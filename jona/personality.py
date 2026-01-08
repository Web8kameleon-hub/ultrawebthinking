"""
JONA Personality Engine
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Any


class PersonalityTrait(Enum):
    """Personality traits"""
    EMPATHETIC = "empathetic"
    ANALYTICAL = "analytical"
    CREATIVE = "creative"
    SUPPORTIVE = "supportive"


@dataclass
class JonaPersonalityState:
    """Personality state"""
    dominant_trait: PersonalityTrait = PersonalityTrait.EMPATHETIC
    traits: Dict[str, float] = None

    def __post_init__(self) -> None:
        if self.traits is None:
            self.traits = {
                "empathetic": 0.8,
                "analytical": 0.7,
                "creative": 0.75,
                "supportive": 0.85
            }


class PersonalityEngine:
    """Personality engine"""

    def __init__(self) -> None:
        self.state = JonaPersonalityState()

    async def get_personality_state(self) -> JonaPersonalityState:
        """Get current personality state"""
        return self.state
