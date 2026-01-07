"""
Session Store
============

Persistent session management for JONA.
"""

import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import logging

from jona.persistence.storage import JONAStorage
from jona.core.session_manager import SessionData, SessionStatus, SessionType


logger = logging.getLogger(__name__)


@dataclass
class SessionStoreConfig:
    """Session store configuration"""
    auto_save_interval: int = 60
    max_sessions_in_memory: int = 100
    cleanup_interval: int = 300  # 5 minutes
    session_timeout_hours: int = 24


class SessionStore:
    """
    Persistent session storage with caching.

    Manages session persistence and automatic cleanup.
    """

    def __init__(
        self,
        storage: JONAStorage,
        config: Optional[SessionStoreConfig] = None
    ):
        self.storage = storage
        self.config = config or SessionStoreConfig()
        self._memory_cache: Dict[str, SessionData] = {}
        self._last_save: Dict[str, datetime] = {}
        self._running = False
        self._cleanup_task: Optional[asyncio.Task] = None
        self._auto_save_task: Optional[asyncio.Task] = None

    async def start(self) -> None:
        """Start the session store"""
        if self._running:
            return

        self._running = True
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        self._auto_save_task = asyncio.create_task(
            self._auto_save_loop()
        )

        logger.info("Session store started")

    async def stop(self) -> None:
        """Stop the session store"""
        if not self._running:
            return

        self._running = False

        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass

        if self._auto_save_task:
            self._auto_save_task.cancel()
            try:
                await self._auto_save_task
            except asyncio.CancelledError:
                pass

        # Final save of all cached sessions
        await self._save_all_cached_sessions()

        logger.info("Session store stopped")

    async def save_session(self, session: SessionData) -> bool:
        """Save session to persistent storage"""
        try:
            session_dict = session.to_dict()
            success = await self.storage.save_session(
                session.session_id, session_dict
            )

            if success:
                self._memory_cache[session.session_id] = session
                self._last_save[session.session_id] = datetime.now()
                logger.debug("Saved session %s", session.session_id)
            else:
                logger.error("Failed to save session %s",
                             session.session_id)

            return success

        except Exception as e:
            msg = f"Error saving session {session.session_id}: {e}"
            logger.error(msg)
            return False

    async def load_session(
        self, session_id: str
    ) -> Optional[SessionData]:
        """Load session from storage"""
        try:
            # Check memory cache first
            if session_id in self._memory_cache:
                session = self._memory_cache[session_id]
                # Check if session is still valid
                if not session.is_expired():
                    session.update_activity()
                    return session
                else:
                    # Remove expired session from cache
                    del self._memory_cache[session_id]

            # Load from persistent storage
            session_dict = await self.storage.load_session(
                session_id
            )
            if session_dict:
                session = SessionData.from_dict(session_dict)
                # Cache in memory if not expired
                if not session.is_expired():
                    self._memory_cache[session.session_id] = session
                    self._last_save[session.session_id] = (
                        datetime.now()
                    )
                    return session

            return None

        except Exception as e:
            logger.error("Error loading session %s: %s", session_id, e)
            return None

    async def delete_session(self, session_id: str) -> bool:
        """Delete session from storage"""
        try:
            # Remove from memory cache
            if session_id in self._memory_cache:
                del self._memory_cache[session_id]
            if session_id in self._last_save:
                del self._last_save[session_id]

            # Delete from persistent storage
            success = await self.storage.delete_session(session_id)
            if success:
                logger.debug("Deleted session %s", session_id)
            return success

        except Exception as e:
            logger.error("Error deleting session %s: %s", session_id, e)
            return False

    async def get_active_sessions(
        self
    ) -> List[SessionData]:
        """Get all active (non-expired) sessions"""
        try:
            session_ids = await self.storage.list_sessions()
            active_sessions = []

            for session_id in session_ids:
                session = await self.load_session(session_id)
                if (session and not session.is_expired()
                        and session.status == SessionStatus.ACTIVE):
                    active_sessions.append(session)

            return active_sessions

        except Exception as e:
            logger.error("Error getting active sessions: %s", e)
            return []

    async def get_user_sessions(
        self, user_id: str
    ) -> List[SessionData]:
        """Get all sessions for a specific user"""
        try:
            all_sessions = await self.get_active_sessions()
            return [s for s in all_sessions if s.user_id == user_id]

        except Exception as e:
            logger.error("Error getting user sessions for %s: %s",
                         user_id, e)
            return []

    async def update_session_activity(
        self, session_id: str
    ) -> bool:
        """Update session last activity time"""
        try:
            session = await self.load_session(session_id)
            if session:
                session.update_activity()
                # Mark for auto-save
                self._last_save[session_id] = datetime.min
                return True
            return False

        except Exception as e:
            logger.error("Error updating session activity %s: %s",
                         session_id, e)
            return False

    async def expire_old_sessions(
        self, max_age_hours: int = 24
    ) -> int:
        """Expire sessions older than specified hours"""
        try:
            cutoff_time = datetime.now() - timedelta(
                hours=max_age_hours
            )
            expired_count = 0

            session_ids = await self.storage.list_sessions()

            for session_id in session_ids:
                session = await self.load_session(session_id)
                if session and session.created_at < cutoff_time:
                    session.status = SessionStatus.EXPIRED
                    await self.save_session(session)
                    expired_count += 1

                    # Remove from memory cache
                    if session_id in self._memory_cache:
                        del self._memory_cache[session_id]

            logger.info("Expired %d old sessions", expired_count)
            return expired_count

        except Exception as e:
            logger.error("Error expiring old sessions: %s", e)
            return 0

    async def get_session_stats(self) -> Dict[str, Any]:
        """Get session statistics"""
        try:
            all_sessions = await self.get_active_sessions()

            total_sessions = len(all_sessions)
            active_sessions = len(
                [s for s in all_sessions
                 if s.status == SessionStatus.ACTIVE]
            )
            paused_sessions = len(
                [s for s in all_sessions
                 if s.status == SessionStatus.PAUSED]
            )

            # Count by type
            type_counts = {}
            for session_type in SessionType:
                type_counts[session_type.value] = len([
                    s for s in all_sessions
                    if s.session_type == session_type
                ])

            # Average session duration
            durations = []
            for session in all_sessions:
                if session.status in (
                    SessionStatus.COMPLETED,
                    SessionStatus.TERMINATED
                ):
                    duration = (
                        session.last_activity - session.created_at
                    ).total_seconds()
                    durations.append(duration)

            avg_duration = (
                sum(durations) / len(durations) if durations else 0
            )

            return {
                "total_sessions": total_sessions,
                "active_sessions": active_sessions,
                "paused_sessions": paused_sessions,
                "sessions_by_type": type_counts,
                "average_duration_seconds": avg_duration,
                "cached_sessions": len(self._memory_cache),
                "last_updated": datetime.now().isoformat(),
            }

        except Exception as e:
            logger.error("Error getting session stats: %s", e)
            return {"error": str(e)}

    async def _cleanup_loop(self) -> None:
        """Background cleanup loop"""
        while self._running:
            try:
                await asyncio.sleep(
                    self.config.cleanup_interval
                )

                # Expire old sessions
                await self.expire_old_sessions(
                    self.config.session_timeout_hours
                )

                # Clean memory cache if too large
                cache_size = len(self._memory_cache)
                max_size = self.config.max_sessions_in_memory
                if cache_size > max_size:
                    # Remove least recently used sessions
                    sorted_sessions = sorted(
                        self._memory_cache.items(),
                        key=lambda x: x[1].last_activity
                    )
                    remove_count = cache_size - max_size
                    sessions_to_remove = sorted_sessions[:remove_count]

                    for session_id, _ in sessions_to_remove:
                        del self._memory_cache[session_id]
                        if session_id in self._last_save:
                            del self._last_save[session_id]

                    logger.debug("Cleaned up %d sessions from cache",
                                 len(sessions_to_remove))

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in cleanup loop: %s", e)

    async def _auto_save_loop(self) -> None:
        """Background auto-save loop"""
        while self._running:
            try:
                await asyncio.sleep(
                    self.config.auto_save_interval
                )

                # Save modified sessions
                cutoff_time = datetime.now() - timedelta(
                    seconds=self.config.auto_save_interval
                )

                sessions_to_save = [
                    session_id for session_id, last_save
                    in self._last_save.items()
                    if (last_save < cutoff_time
                        and session_id in self._memory_cache)
                ]

                for session_id in sessions_to_save:
                    session = self._memory_cache[session_id]
                    await self.save_session(session)

                if sessions_to_save:
                    logger.debug("Auto-saved %d sessions",
                                 len(sessions_to_save))

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in auto-save loop: %s", e)

    async def _save_all_cached_sessions(self) -> None:
        """Save all cached sessions (used during shutdown)"""
        try:
            for session_id, session in self._memory_cache.items():
                await self.save_session(session)
            logger.debug("Saved %d cached sessions",
                         len(self._memory_cache))
        except Exception as e:
            logger.error("Error saving cached sessions: %s", e)
