"""
Storage Layer
============

Data persistence for JONA system.
"""

import json
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Any, Optional, TypeVar, Generic
import aiofiles
import logging


logger = logging.getLogger(__name__)


T = TypeVar('T')


@dataclass
class StorageConfig:
    """Storage configuration"""
    base_path: str = "./data/jona"
    max_file_size_mb: int = 10
    compression_enabled: bool = False
    backup_enabled: bool = True
    backup_retention_days: int = 7


class StorageError(Exception):
    """Storage operation error"""
    pass


class BaseStorage(ABC, Generic[T]):
    """Abstract base class for storage implementations"""

    def __init__(self, config: StorageConfig):
        self.config = config
        self._ensure_storage_path()

    def _ensure_storage_path(self):
        """Ensure storage directory exists"""
        os.makedirs(self.config.base_path, exist_ok=True)

    @abstractmethod
    async def save(self, key: str, data: T) -> None:
        """Save data to storage"""
        pass

    @abstractmethod
    async def load(self, key: str) -> Optional[T]:
        """Load data from storage"""
        pass

    @abstractmethod
    async def delete(self, key: str) -> None:
        """Delete data from storage"""
        pass

    @abstractmethod
    async def exists(self, key: str) -> bool:
        """Check if key exists in storage"""
        pass


class JSONStorage(BaseStorage[Dict[str, Any]]):
    """JSON file based storage"""

    async def save(self, key: str, data: Dict[str, Any]) -> None:
        """Save dictionary to JSON file"""
        try:
            file_path = os.path.join(self.config.base_path, f"{key}.json")
            file_size_mb = len(json.dumps(data)) / (1024 * 1024)

            if file_size_mb > self.config.max_file_size_mb:
                msg = (f"Data size {file_size_mb:.2f}MB exceeds "
                       f"limit {self.config.max_file_size_mb}MB")
                raise StorageError(msg)

            if self.config.backup_enabled:
                self._backup_file(file_path)

            async with aiofiles.open(file_path, 'w') as f:
                await f.write(json.dumps(data, indent=2))

            logger.info("Saved %s to %s", key, file_path)

        except IOError as e:
            msg = f"Failed to save {key}: {e}"
            logger.error(msg)
            raise StorageError(msg) from e

    async def load(self, key: str) -> Optional[Dict[str, Any]]:
        """Load dictionary from JSON file"""
        try:
            file_path = os.path.join(self.config.base_path, f"{key}.json")

            if not os.path.exists(file_path):
                logger.debug("File not found: %s", file_path)
                return None

            async with aiofiles.open(file_path, 'r') as f:
                content = await f.read()
                data = json.loads(content)

            logger.info("Loaded %s from %s", key, file_path)
            return data

        except (IOError, json.JSONDecodeError) as e:
            msg = f"Failed to load {key}: {e}"
            logger.error(msg)
            raise StorageError(msg) from e

    async def delete(self, key: str) -> None:
        """Delete JSON file"""
        try:
            file_path = os.path.join(self.config.base_path, f"{key}.json")

            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info("Deleted %s", key)
            else:
                logger.debug("File not found for deletion: %s", key)

        except OSError as e:
            msg = f"Failed to delete {key}: {e}"
            logger.error(msg)
            raise StorageError(msg) from e

    async def exists(self, key: str) -> bool:
        """Check if JSON file exists"""
        file_path = os.path.join(self.config.base_path, f"{key}.json")
        return os.path.exists(file_path)

    def _backup_file(self, file_path: str) -> None:
        """Create backup of existing file"""
        if os.path.exists(file_path):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = f"{file_path}.backup.{timestamp}"
            try:
                with open(file_path, 'r') as src:
                    content = src.read()
                with open(backup_path, 'w') as dst:
                    dst.write(content)
                logger.debug("Created backup: %s", backup_path)
            except IOError as e:
                logger.warning("Failed to create backup: %s", e)


class JONAStorage:
    """Main storage interface for JONA"""

    def __init__(self, config: Optional[StorageConfig] = None):
        self.config = config or StorageConfig()
        self._json_storage = JSONStorage(self.config)

    async def save_session(
        self, session_id: str, session_data: Dict[str, Any]
    ) -> None:
        """Save session data"""
        await self._json_storage.save(f"session_{session_id}",
                                      session_data)

    async def load_session(
        self, session_id: str
    ) -> Optional[Dict[str, Any]]:
        """Load session data"""
        return await self._json_storage.load(f"session_{session_id}")

    async def save_state(
        self, state_key: str, state_data: Dict[str, Any]
    ) -> None:
        """Save system state"""
        await self._json_storage.save(f"state_{state_key}", state_data)

    async def load_state(self, state_key: str) -> Optional[Dict[str, Any]]:
        """Load system state"""
        return await self._json_storage.load(f"state_{state_key}")

    async def delete_session(self, session_id: str) -> None:
        """Delete session data"""
        await self._json_storage.delete(f"session_{session_id}")

    async def session_exists(self, session_id: str) -> bool:
        """Check if session exists"""
        return await self._json_storage.exists(f"session_{session_id}")

    async def health_check(self) -> Dict[str, Any]:
        """Check storage health"""
        try:
            test_data = {"timestamp": datetime.now().isoformat()}
            await self._json_storage.save("health_check", test_data)
            loaded = await self._json_storage.load("health_check")
            await self._json_storage.delete("health_check")

            if loaded == test_data:
                return {
                    "status": "healthy",
                    "storage_path": self.config.base_path,
                    "readable": True,
                    "writable": True
                }
            else:
                return {
                    "status": "degraded",
                    "storage_path": self.config.base_path,
                    "readable": True,
                    "writable": True,
                    "message": "Data integrity check failed"
                }

        except StorageError as e:
            return {
                "status": "unhealthy",
                "storage_path": self.config.base_path,
                "readable": False,
                "writable": False,
                "error": str(e)
            }
