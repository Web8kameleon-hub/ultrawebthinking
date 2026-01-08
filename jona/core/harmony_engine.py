"""
Harmony Engine for JONA - Audio harmony and resonance
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
import numpy as np
from enum import Enum


class HarmonyMode(Enum):
    """Harmony generation modes"""
    MEDITATIVE = "meditative"
    ENERGIZING = "energizing"
    BALANCED = "balanced"


@dataclass
class HarmonyMetrics:
    """Harmony quality metrics"""
    resonance_score: float = 0.0
    coherence_level: float = 0.0
    harmonic_ratio: float = 0.0
    frequency_alignment: float = 0.0
    overall_quality: float = 0.0

    def to_dict(self) -> dict:
        return {
            "resonance_score": self.resonance_score,
            "coherence_level": self.coherence_level,
            "harmonic_ratio": self.harmonic_ratio,
            "frequency_alignment": self.frequency_alignment,
            "overall_quality": self.overall_quality
        }


@dataclass
class HarmonyConfig:
    """Harmony engine configuration"""
    mode: HarmonyMode = HarmonyMode.BALANCED
    base_frequency: float = 432.0  # Hz
    harmonic_series: List[float] = field(default_factory=lambda: [1, 1.5, 2, 2.5, 3])
    resonance_strength: float = 0.8
    coherence_threshold: float = 0.7


class HarmonyEngine:
    """Generates harmonic audio and metrics"""

    def __init__(self, config: Optional[HarmonyConfig] = None):
        self.config = config or HarmonyConfig()
        self.harmonics: Dict[str, float] = {}
        self.metrics = HarmonyMetrics()

    def generate_harmony(self, input_frequencies: List[float], duration_ms: int = 5000) -> dict:
        """Generate harmony from frequencies"""
        sample_rate = 44100
        samples = int((duration_ms / 1000) * sample_rate)

        # Generate harmonic frequencies
        harmonics = {}
        for i, ratio in enumerate(self.config.harmonic_series):
            freq = self.config.base_frequency * ratio
            harmonics[f"harmonic_{i}"] = freq

        # Calculate metrics
        self.metrics = self._calculate_metrics(input_frequencies)

        return {
            "harmonics": harmonics,
            "metrics": self.metrics.to_dict(),
            "duration_ms": duration_ms,
            "sample_rate": sample_rate
        }

    def _calculate_metrics(self, frequencies: List[float]) -> HarmonyMetrics:
        """Calculate harmony metrics"""
        if not frequencies:
            return HarmonyMetrics()

        frequencies = np.array(frequencies)
        base = self.config.base_frequency

        # Calculate resonance (how close to base frequency)
        resonance = 1.0 - np.mean(np.abs(frequencies - base) / base)
        resonance = max(0, min(1, resonance))

        # Calculate coherence (frequency stability)
        coherence = 1.0 - (np.std(frequencies) / (np.mean(frequencies) + 1e-6))
        coherence = max(0, min(1, coherence))

        # Calculate harmonic alignment
        alignment = sum(1 for f in frequencies if abs(f - base) / base < 0.1) / len(frequencies)

        return HarmonyMetrics(
            resonance_score=float(resonance),
            coherence_level=float(coherence),
            harmonic_ratio=float(alignment),
            frequency_alignment=float(alignment),
            overall_quality=float((resonance + coherence + alignment) / 3)
        )

    def adjust_harmony(self, parameter: str, value: float) -> None:
        """Adjust harmony parameter"""
        if hasattr(self.config, parameter):
            setattr(self.config, parameter, value)

    def get_metrics(self) -> HarmonyMetrics:
        """Get current harmony metrics"""
        return self.metrics
