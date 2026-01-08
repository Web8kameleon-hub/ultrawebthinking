"""
Event Bus for JONA - Async event system
"""

from dataclasses import dataclass, field
from typing import Callable, List, Dict, Any
from datetime import datetime
import asyncio


@dataclass
class Event:
    """Base event structure"""
    event_type: str
    data: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    source: str = "system"

    def to_dict(self) -> dict:
        return {
            "event_type": self.event_type,
            "data": self.data,
            "timestamp": self.timestamp.isoformat(),
            "source": self.source
        }


class EventBus:
    """Async event bus for system-wide events"""

    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        self.event_history: List[Event] = []
        self.max_history = 1000

    def subscribe(self, event_type: str, callback: Callable) -> None:
        """Subscribe to event type"""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(callback)

    def unsubscribe(self, event_type: str, callback: Callable) -> None:
        """Unsubscribe from event type"""
        if event_type in self.subscribers:
            self.subscribers[event_type].remove(callback)

    async def emit(self, event: Event) -> None:
        """Emit event to all subscribers"""
        # Store in history
        self.event_history.append(event)
        if len(self.event_history) > self.max_history:
            self.event_history = self.event_history[-self.max_history:]

        # Call all subscribers
        if event.event_type in self.subscribers:
            tasks = []
            for callback in self.subscribers[event.event_type]:
                if asyncio.iscoroutinefunction(callback):
                    tasks.append(callback(event))
                else:
                    callback(event)
            
            if tasks:
                await asyncio.gather(*tasks)

    def get_history(self, event_type: str = None, limit: int = 100) -> List[Event]:
        """Get event history"""
        if event_type:
            return [e for e in self.event_history if e.event_type == event_type][-limit:]
        return self.event_history[-limit:]

    def clear_history(self) -> int:
        """Clear event history, return count"""
        count = len(self.event_history)
        self.event_history = []
        return count
