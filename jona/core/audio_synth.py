"""
Audio Synthesizer
================

Audio generation and synthesis module for therapeutic sounds.
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional, List
import logging

logger = logging.getLogger(__name__)


@dataclass
class AudioConfig:
    """Audio configuration"""
    sample_rate: int = 44100
    bit_depth: int = 16
    channels: int = 2


class AudioSynthesizer:
    """Audio synthesis and generation"""

    def __init__(self, config: Optional[AudioConfig] = None) -> None:
        """Initialize AudioSynthesizer"""
        self.config = config or AudioConfig()
        self.audio_buffer: List[float] = []

    def generate_sine_wave(
        self,
        frequency: float,
        duration: float,
        amplitude: float = 0.5
    ) -> List[float]:
        """Generate a sine wave"""
        try:
            import math
            samples = []
            num_samples = int(self.config.sample_rate * duration)
            for i in range(num_samples):
                t = i / self.config.sample_rate
                sample = (
                    amplitude *
                    math.sin(2 * math.pi * frequency * t)
                )
                samples.append(sample)
            return samples
        except (ValueError, AttributeError) as e:
            logger.error("Sine wave generation failed: %s", str(e))
            return []

    def generate_white_noise(
        self,
        duration: float,
        amplitude: float = 0.5,
        noise_type: str = "white"
    ) -> List[float]:
        """Generate white noise"""
        try:
            import random
            samples = []
            num_samples = int(self.config.sample_rate * duration)
            for _ in range(num_samples):
                sample = amplitude * (random.random() - 0.5) * 2
                samples.append(sample)
            return samples
        except (ValueError, AttributeError) as e:
            logger.error("White noise generation failed: %s", str(e))
            return []

    def generate_binaural_beats(
        self,
        frequency_left: float,
        frequency_right: float,
        duration: float
    ) -> List[float]:
        """Generate binaural beats"""
        try:
            import math
            samples = []
            num_samples = int(self.config.sample_rate * duration)
            for i in range(num_samples):
                t = i / self.config.sample_rate
                left = math.sin(2 * math.pi * frequency_left * t)
                right = math.sin(2 * math.pi * frequency_right * t)
                sample = (left + right) / 2
                samples.append(sample)
            return samples
        except (ValueError, AttributeError) as e:
            logger.error("Binaural beats generation failed: %s", str(e))
            return []

    def apply_fade_in(
        self,
        samples: List[float],
        duration: float
    ) -> List[float]:
        """Apply fade in effect"""
        try:
            fade_samples = int(self.config.sample_rate * duration)
            result = samples.copy()
            for i in range(min(fade_samples, len(result))):
                result[i] *= i / fade_samples
            return result
        except (ValueError, IndexError) as e:
            logger.error("Fade in failed: %s", str(e))
            return samples

    def apply_fade_out(
        self,
        samples: List[float],
        duration: float
    ) -> List[float]:
        """Apply fade out effect"""
        try:
            fade_samples = int(self.config.sample_rate * duration)
            result = samples.copy()
            start = len(result) - fade_samples
            for i in range(max(0, start), len(result)):
                fade_pos = i - start
                result[i] *= (
                    (fade_samples - fade_pos) / fade_samples
                )
            return result
        except (ValueError, IndexError) as e:
            logger.error("Fade out failed: %s", str(e))
            return samples

    def audio_to_wav_bytes(
        self,
        samples: List[float]
    ) -> bytes:
        """Convert audio samples to WAV bytes"""
        try:
            import wave
            import io
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wav_file:
                wav_file.setnchannels(self.config.channels)
                wav_file.setsampwidth(self.config.bit_depth // 8)
                wav_file.setframerate(self.config.sample_rate)
                # Convert float samples to bytes
                audio_data = bytearray()
                for sample in samples:
                    sample_int = int(
                        sample * ((2 ** 15) - 1)
                    )
                    audio_data.extend(
                        sample_int.to_bytes(2, 'little', signed=True)
                    )
                wav_file.writeframes(bytes(audio_data))
            wav_buffer.seek(0)
            return wav_buffer.getvalue()
        except (ValueError, IOError, AttributeError) as e:
            logger.error("WAV conversion failed: %s", str(e))
            return b''

    def stop_audio(self) -> None:
        """Stop audio playback"""
        try:
            self.audio_buffer = []
            logger.info("Audio stopped")
        except Exception as e:
            logger.error("Stop audio failed: %s", str(e))

    def get_audio_info(self) -> Dict[str, Any]:
        """Get audio information"""
        return {
            "sample_rate": self.config.sample_rate,
            "bit_depth": self.config.bit_depth,
            "channels": self.config.channels,
            "buffer_size": len(self.audio_buffer)
        }
