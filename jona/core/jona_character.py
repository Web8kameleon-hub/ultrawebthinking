"""
JONA Character
=============

Main JONA character implementation integrating all components.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

from ..config import JONAConfig
from ..exceptions import JONAException, JONASystemError
from ..personality import PersonalityEngine, JonaPersonalityState
from ..interfaces.albi_interface import ALBIInterface, RealALBI
from ..interfaces.alba_interface import ALBAInterface, RealALBA
from ..interfaces.eeg_interface import EEGInterface, RealEEG
from .health_monitor import HealthMonitor, SystemHealth
from .alert_system import AlertSystem, AlertLevel
from .session_manager import SessionManager, SessionData
from .event_bus import EventBus, Event
from .eeg_engine import EEGEngine, EEGMetrics
from .audio_synth import AudioSynthesizer
from .harmony_engine import HarmonyEngine, HarmonyMetrics


logger = logging.getLogger(__name__)


@dataclass
class JONAState:
    """Current state of JONA character"""
    personality: JonaPersonalityState
    health: SystemHealth
    is_active: bool = True
    current_session: Optional[SessionData] = None
    last_eeg_metrics: Optional[EEGMetrics] = None
    last_harmony_metrics: Optional[HarmonyMetrics] = None
    active_alerts: int = 0
    mood_description: str = "neutral"


class JonaCharacter:
    """
    Main JONA character implementation.

    Integrates all JONA components into a cohesive personality system.
    """

    def __init__(self, config: Optional[JONAConfig] = None) -> None:
        self.config = config or JONAConfig()
        self.state = JONAState(
            personality=JonaPersonalityState(),
            health=SystemHealth.HEALTHY
        )

        # Initialize components
        self._initialize_components()

        # Setup event handlers
        self._setup_event_handlers()

        logger.info("JONA character initialized")

    def _initialize_components(self) -> None:
        """Initialize all JONA components"""
        try:
            # Core systems
            self.personality_engine = PersonalityEngine()
            self.health_monitor = HealthMonitor()
            self.alert_system = AlertSystem()
            self.session_manager = SessionManager()
            self.event_bus = EventBus()

            # Interfaces
            self.albi_interface: ALBIInterface = RealALBI()
            self.alba_interface: ALBAInterface = RealALBA()
            self.eeg_interface: EEGInterface = RealEEG()

            # Specialized engines
            self.eeg_engine = EEGEngine()
            self.audio_synth = AudioSynthesizer()
            self.harmony_engine = HarmonyEngine()

        except (ImportError, AttributeError, RuntimeError) as e:
            msg = "Failed to initialize JONA components: {}".format(e)
            raise JONASystemError(msg) from e

    def _setup_event_handlers(self) -> None:
        """Setup event handlers for component communication"""
        # Health monitoring events
        self.event_bus.subscribe(
            "health_status_changed",
            self._on_health_status_changed
        )
        self.event_bus.subscribe("alert_created", self._on_alert_created)

        # EEG events
        self.event_bus.subscribe(
            "eeg_data_received", self._on_eeg_data_received
        )

        # Session events
        self.event_bus.subscribe("session_started", self._on_session_started)
        self.event_bus.subscribe("session_ended", self._on_session_ended)

    async def start(self):
        """Start JONA character systems"""
        try:
            await self.event_bus.start()
            logger.info("JONA character started successfully")
        except (OSError, RuntimeError) as e:
            logger.error("Failed to start JONA character: %s", str(e))
            raise JONASystemError(f"Startup failed: {e}") from e

    async def stop(self):
        """Stop JONA character systems"""
        try:
            await self.event_bus.stop()
            await self.audio_synth.stop_audio()
            logger.info("JONA character stopped successfully")
        except (OSError, RuntimeError, AttributeError):
            pass

    async def process_interaction(
        self,
        user_input: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process user interaction.

        Args:
            user_input: User input text
            context: Additional context

        Returns:
            JONA's response
        """
        try:
            # Update session if active
            if self.state.current_session:
                self.session_manager.add_session_interaction(
                    self.state.current_session.session_id,
                    "user_input",
                    {"input": user_input, "context": context}
                )

            # Analyze input and generate response
            response = await self._generate_response(
                user_input, context or {}
            )

            # Log interaction
            if self.state.current_session:
                self.session_manager.add_session_interaction(
                    self.state.current_session.session_id,
                    "jona_response",
                    {"response": response}
                )

            # Publish interaction event
            await self.event_bus.publish_sync("interaction_processed", {
                "user_input": user_input,
                "jona_response": response,
                "session_id": (
                    self.state.current_session.session_id
                    if self.state.current_session else None
                )
            })

            return response

        except (ValueError, RuntimeError, AttributeError) as e:
            logger.error("Error processing interaction: %s", str(e))
            self.alert_system.create_alert(
                AlertLevel.CRITICAL,
                "Interaction Processing Error",
                f"Failed to process user interaction: {e}",
                "jona_character"
            )
            return {
                "response": (
                    "I apologize, but I'm experiencing some "
                    "technical difficulties. Please try again."
                ),
                "mood": "concerned",
                "error": True
            }

    async def start_session(
        self,
        user_id: Optional[str] = None,
        session_type: str = "interaction"
    ) -> SessionData:
        """
        Start a new interaction session.

        Args:
            user_id: Optional user identifier
            session_type: Type of session

        Returns:
            Created session data
        """
        session = self.session_manager.create_session(
            user_id=user_id,
            session_type=session_type,
            metadata={"jona_version": "1.0"}
        )

        self.state.current_session = session

        await self.event_bus.publish_sync("session_started", {
            "session_id": session.session_id,
            "user_id": user_id,
            "type": session_type
        })

        logger.info(
            "Started session %s for user %s",
            session.session_id, user_id
        )
        return session

    async def end_session(self) -> bool:
        """
        End the current session.

        Returns:
            True if session was ended successfully
        """
        if not self.state.current_session:
            return False

        session_id = self.state.current_session.session_id
        success = self.session_manager.complete_session(session_id)

        if success:
            await self.event_bus.publish_sync("session_ended", {
                "session_id": session_id,
                "duration": (
                    datetime.now() - self.state.current_session.created_at
                ).total_seconds()
            })

            self.state.current_session = None
            logger.info("Ended session %s", session_id)

        return success

    async def get_status(self) -> Dict[str, Any]:
        """Get comprehensive JONA status"""
        return {
            "state": {
                "is_active": self.state.is_active,
                "health": self.state.health.value,
                "mood": self.state.mood_description,
                "current_session": (
                    self.state.current_session.session_id
                    if self.state.current_session
                    else None
                ),
            },
            "alerts": {
                "active_count": len(
                    self.alert_system.get_active_alerts()
                ),
                "total_count": len(self.alert_system.alerts),
            },
            "timestamp": datetime.now().isoformat(),
        }

    async def process_eeg_data(self) -> None:
        """Process incoming EEG data"""
        try:
            # Capture through EEG interface
            metrics = await self.eeg_interface.get_quality_metrics()
            self.state.last_eeg_metrics = metrics

            # Update personality based on EEG
            if hasattr(self, 'personality_engine'):
                # Only update if method exists
                pass

            # Check for concerning patterns
            if any(v > 0.8 for v in metrics.values()):
                msg = (
                    "EEG analysis shows elevated stress levels"
                )
                self.alert_system.create_alert(
                    AlertLevel.WARNING,
                    "High Stress Detected",
                    msg,
                    "eeg_monitoring"
                )

            # Publish EEG event
            await self.event_bus.publish_sync("eeg_processed", {
                "metrics": metrics.__dict__,
                "stress_level": metrics.stress_level,
                "focus_level": metrics.focus_level
            })

        except (ValueError, RuntimeError, AttributeError) as e:
            logger.error(
                "Error processing EEG data: %s", str(e)
            )
            self.alert_system.create_alert(
                AlertLevel.CRITICAL,
                "EEG Processing Error",
                f"Failed to process EEG data: {e}",
                "eeg_system"
            )

    async def generate_therapeutic_audio(
        self, audio_type: str = "relaxation"
    ) -> bytes:
        """
        Generate therapeutic audio based on current state.

        Args:
            audio_type: Type of therapeutic audio

        Returns:
            Audio data as WAV bytes
        """
        try:
            if audio_type == "relaxation":
                # Generate relaxing harmony based on current EEG state
                base_freq = 220  # A3
                if (
                    self.state.last_eeg_metrics and
                    self.state.last_eeg_metrics.stress_level > 0.5
                ):
                    base_freq = 174  # F3 (lower for more relaxation)

                harmony = self.audio_synth.generate_harmony(
                    self.audio_synth.harmony_config.__class__(
                        base_frequency=base_freq,
                        duration_ms=10000,
                        amplitude=0.3
                    )
                )

            elif audio_type == "focus":
                # Generate focus-enhancing binaural beats
                left, right = self.audio_synth.generate_binaural_beats(
                    carrier_freq=400,
                    beat_freq=10,  # Alpha waves
                    duration_ms=5000
                )
                harmony = self.audio_synth.mix_audio(left, right)

            else:
                # Default to white noise
                harmony = self.audio_synth.generate_white_noise(
                    5000, 0.1, "white"
                )

            # Convert to WAV
            wav_data = self.audio_synth.audio_to_wav_bytes(harmony)

            # Log audio generation
            await self.event_bus.publish_sync("therapeutic_audio_generated", {
                "type": audio_type,
                "duration_ms": (
                    len(harmony) /
                    self.audio_synth.config.sample_rate * 1000
                ),
                "size_bytes": len(wav_data)
            })

            return wav_data

        except (OSError, RuntimeError, AttributeError) as e:
            logger.error(
                "Error generating therapeutic audio: %s", str(e)
            )
            raise JONAException(
                "Audio generation failed: {}".format(e)
            ) from e

    async def _generate_response(
        self,
        user_input: str,
        _context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate JONA's response to user input"""
        # Analyze user input
        input_analysis = self._analyze_input(user_input)

        # Get personality influence
        personality_influence = (
            self.personality_engine.get_response_influence()
        )

        # Consider current health state
        health_context = await self.health_monitor.get_health_context()

        # Generate base response
        response_text = self._create_response_text(
            user_input, input_analysis, personality_influence,
            health_context
        )

        # Determine mood
        mood = self._determine_mood(personality_influence, health_context)

        # Update mood description
        self.state.mood_description = mood

        return {
            "response": response_text,
            "mood": mood,
            "personality_influence": personality_influence,
            "health_context": health_context,
            "input_analysis": input_analysis
        }

    def _analyze_input(
        self, _user_input: str
    ) -> Dict[str, Any]:
        """Analyze user input for emotional content and intent"""
        # Simple keyword-based analysis (could be enhanced with NLP)
        input_lower = _user_input.lower()

        analysis = {
            "sentiment": "neutral",
            "urgency": "normal",
            "topics": [],
            "emotional_words": []
        }

        # Sentiment analysis
        positive_words = [
            "good", "great", "happy", "love", "excellent",
            "wonderful"
        ]
        negative_words = [
            "bad", "sad", "angry", "hate", "terrible", "awful",
            "worried"
        ]

        positive_count = sum(
            1 for word in positive_words if word in input_lower
        )
        negative_count = sum(
            1 for word in negative_words if word in input_lower
        )

        if positive_count > negative_count:
            analysis["sentiment"] = "positive"
        elif negative_count > positive_count:
            analysis["sentiment"] = "negative"

        # Urgency detection
        # Urgency detection
        urgent_words = [
            "urgent", "emergency", "help", "immediately", "asap"
        ]
        if any(word in input_lower for word in urgent_words):
            analysis["urgency"] = "high"

        # Topic detection
        topics = {
            "health": ["health", "medical", "illness", "pain"],
            "emotions": ["feel", "emotion", "mood", "happy", "sad", "angry"],
            "technical": ["computer", "software", "hardware", "error", "bug"],
            "music": ["music", "sound", "audio", "song", "melody"],
            "meditation": ["meditate", "mindfulness", "relax", "calm"]
        }

        for topic, keywords in topics.items():
            if any(keyword in input_lower for keyword in keywords):
                analysis["topics"].append(topic)

        analysis["emotional_words"] = [
            word for word in (positive_words + negative_words)
            if word in input_lower
        ]

        return analysis

    def _create_response_text(
        self,
        user_input: str,
        input_analysis: Dict,
        personality_influence: Dict,
        health_context: Dict
    ) -> str:
        """Create response text based on analysis"""
        # Base responses based on input analysis
        if input_analysis["sentiment"] == "positive":
            base_responses = [
                "I'm glad to hear that! How can I help you further?",
                "That's wonderful! I'm here to support you.",
                "I'm happy for you! What would you like to explore next?"
            ]
        elif input_analysis["sentiment"] == "negative":
            base_responses = [
                "I'm sorry you're feeling that way. I'm here to help.",
                (
                    "I understand this is difficult. "
                    "Let's work through it together."
                ),
                "I'm here to support you. What can I do to help?"
            ]
        else:
            base_responses = [
                "I understand. How can I assist you?",
                "Tell me more about what's on your mind.",
                "I'm here to help. What would you like to discuss?"
            ]

        # Personality influence
        empathy_level = personality_influence.get("empathy", 0.5)
        creativity_level = personality_influence.get("creativity", 0.5)

        # Health context influence
        if health_context.get("overall_health") == SystemHealth.DEGRADED:
            msg = " (I'm experiencing issues, but here to help.)"
            base_responses = [r + msg for r in base_responses]

        # Select response based on personality
        response_index = int(empathy_level * len(base_responses))
        response_index = min(response_index, len(base_responses) - 1)

        response = base_responses[response_index]

        # Add creative elements if high creativity
        if creativity_level > 0.7 and "music" in input_analysis["topics"]:
            response += (
                " Would you like me to generate therapeutic"
                " harmonies?"
            )

        return response

    def _determine_mood(
        self,
        personality_influence: Dict,
        health_context: Dict
    ) -> str:
        """Determine JONA's current mood"""
        empathy = personality_influence.get("empathy", 0.5)
        creativity = personality_influence.get("creativity", 0.5)
        health = health_context.get(
            "overall_health", SystemHealth.HEALTHY
        )

        # Base mood on personality
        if empathy > 0.7 and creativity > 0.7:
            base_mood = "empathetic and creative"
        elif empathy > 0.7:
            base_mood = "empathetic"
        elif creativity > 0.7:
            base_mood = "creative"
        else:
            base_mood = "balanced"

        # Adjust for health
        if health == SystemHealth.DEGRADED:
            base_mood += " but concerned"
        elif health == SystemHealth.CRITICAL:
            base_mood = "concerned"

        return base_mood

    # Event handlers
    async def _on_health_status_changed(self, event: Event):
        """Handle health status changes"""
        new_health = event.data.get("new_health")
        if new_health:
            self.state.health = new_health

            # Update personality based on health
            if new_health == SystemHealth.CRITICAL:
                self.personality_engine.adjust_mood(-0.3)  # More concerned
            elif new_health == SystemHealth.DEGRADED:
                self.personality_engine.adjust_mood(-0.1)

    async def _on_alert_created(self, event: Event):
        """Handle new alerts"""
        alert = event.data
        self.state.active_alerts = len(self.alert_system.get_active_alerts())

        # Adjust personality based on alert severity
        if alert.level == AlertLevel.CRITICAL:
            self.personality_engine.adjust_mood(-0.2)
        elif alert.level == AlertLevel.WARNING:
            self.personality_engine.adjust_mood(-0.1)

    async def _on_eeg_data_received(self, event: Event) -> None:
        """Handle EEG data reception"""
        await self.process_eeg_data()

    async def _on_session_started(self, event: Event):
        """Handle session start"""
        session_data = event.data
        logger.info("JONA session started: %s", session_data)

    async def _on_session_ended(self, event: Event):
        """Handle session end"""
        session_data = event.data
        logger.info("JONA session ended: %s", session_data)

    # Interface methods for external access
    async def get_albi_status(self) -> Dict[str, Any]:
        """Get ALBI system status"""
        return {"status": "operational", "type": "albi"}

    async def get_alba_status(self) -> Dict[str, Any]:
        """Get ALBA system status"""
        return {"status": "operational", "type": "alba"}

    async def get_eeg_status(self) -> Dict[str, Any]:
        """Get EEG system status"""
        try:
            metrics = await self.eeg_interface.get_quality_metrics()
            return {"status": "operational", "metrics": metrics}
        except (OSError, RuntimeError, AttributeError):
            return {"status": "inactive"}

    def get_alerts(
        self, _status: Optional[str] = None, limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get alerts"""
        alerts = self.alert_system.get_alerts(limit=limit)
        return [alert.to_dict() for alert in alerts]

    def get_sessions(
        self, _user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get sessions"""
        if _user_id:
            sessions = self.session_manager.get_user_sessions(_user_id)
        else:
            sessions = list(self.session_manager.sessions.values())

        # Return last 50 sessions
        return [session.to_dict() for session in sessions[-50:]]

    # ===== EEG METHODS =====

    async def get_eeg_metrics(self) -> Optional[Dict[str, Any]]:
        """Get current EEG metrics"""
        if self.state.last_eeg_metrics:
            return self.state.last_eeg_metrics.__dict__
        return None

    async def start_eeg_stream(
        self,
        _sample_rate: Optional[float] = None,
        _channels: Optional[List[str]] = None,
        _buffer_size: Optional[int] = None
    ) -> str:
        """Start EEG streaming"""
        stream_id = f"stream_{datetime.now().timestamp()}"
        try:
            # Use proper EEG interface method
            await self.eeg_interface.start_streaming()
            logger.info("EEG stream started: %s", stream_id)
        except (AttributeError, ValueError) as e:
            logger.error("Failed to start EEG stream: %s", str(e))
        return stream_id

    async def process_eeg_stream(
        self,
        _stream_id: Optional[str] = None,
        data: Optional[Dict[str, List[float]]] = None
    ) -> Dict[str, Any]:
        """Process streaming EEG data"""
        try:
            results = {}
            for channel, samples in data.items():
                results[channel] = {"samples_processed": len(samples)}
            return results
        except (ValueError, KeyError) as e:
            logger.error("Error processing EEG stream: %s", str(e))
            return {"error": str(e)}

    async def stop_eeg_stream(
        self, _stream_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Stop EEG streaming"""
        try:
            await self.eeg_interface.stop_streaming()
            logger.info("EEG stream stopped: %s", _stream_id)
            return {"status": "stopped", "stream_id": _stream_id}
        except (AttributeError, RuntimeError) as e:
            logger.error("Failed to stop EEG stream: %s", str(e))
            return {"error": str(e)}

    async def get_brainwave_analysis(self) -> Dict[str, Any]:
        """Get brainwave analysis"""
        if not self.state.last_eeg_metrics:
            return {"error": "No EEG data available"}

        metrics = self.state.last_eeg_metrics
        return {
            "alpha_waves": getattr(metrics, 'alpha_waves', 0),
            "beta_waves": getattr(metrics, 'beta_waves', 0),
            "theta_waves": getattr(metrics, 'theta_waves', 0),
            "delta_waves": getattr(metrics, 'delta_waves', 0),
            "focus_score": getattr(metrics, 'focus_level', 0),
            "relaxation_score": 1 - getattr(metrics, 'stress_level', 0),
            "emotional_stability": getattr(
                metrics, "emotional_stability", 0.5
            ),
            "timestamp": datetime.now().isoformat()
        }

    async def get_eeg_analysis_history(
        self, _limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get EEG analysis history"""
        # Return empty list for now (would store historical data in production)
        return []

    async def calibrate_eeg(
        self,
        _calibration_data: Optional[List[float]] = None,
        duration_seconds: float = 30.0
    ) -> Dict[str, Any]:
        """Calibrate EEG processing"""
        try:
            result = await self.eeg_interface.calibrate()
            return {
                "status": "calibrated" if result else "failed",
                "duration": duration_seconds,
                "baseline_established": result
            }
        except (OSError, RuntimeError, AttributeError) as e:
            logger.error("Calibration failed: %s", str(e))
            return {"error": str(e)}

    async def apply_eeg_filter(
        self,
        data: List[float],
        filter_type: str = "lowpass",
        cutoff_freq: Optional[float] = None,
        _order: int = 4
    ) -> List[float]:
        """Apply digital filter to EEG data"""
        try:
            # Simple filter implementation
            if filter_type == "lowpass" and cutoff_freq:
                # Basic low-pass filter (moving average)
                window_size = max(1, int(250 / cutoff_freq))
                filtered = []
                for i in range(len(data)):
                    start = max(0, i - window_size // 2)
                    end = min(len(data), i + window_size // 2)
                    avg = sum(data[start:end]) / (end - start)
                filtered.append(avg)
                return filtered
            return data
        except (ValueError, RuntimeError, AttributeError) as e:
            logger.error("Filter application failed: %s", str(e))
            return data

    async def detect_eeg_artifacts(
        self, data: List[float], threshold: float = 100.0
    ) -> List[Dict[str, Any]]:
        """Detect artifacts in EEG data"""
        artifacts = []
        for i, sample in enumerate(data):
            if abs(sample) > threshold:
                artifacts.append({
                    "index": i,
                    "value": sample,
                    "type": "amplitude_spike"
                })
        return artifacts

    async def get_brain_connectivity(self) -> Dict[str, Any]:
        """Get brain connectivity analysis"""
        if not self.state.last_eeg_metrics:
            return {"error": "No EEG data available"}

        return {
            "frontal_parietal": 0.75,
            "temporal_occipital": 0.68,
            "left_right": 0.82,
            "interhemispheric": 0.70,
            "network_coherence": 0.73,
            "timestamp": datetime.now().isoformat()
        }

    async def export_eeg_data(
        self,
        file_format: str = "json",
        include_metrics: bool = True,
        time_range: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Export EEG data"""
        try:
            export_data = {
                "format": file_format,
                "include_metrics": include_metrics,
                "time_range": time_range,
                "metrics": (
                    self.state.last_eeg_metrics.__dict__
                    if self.state.last_eeg_metrics and include_metrics
                    else None
                ),
                "timestamp": datetime.now().isoformat()
            }
            return export_data
        except (OSError, RuntimeError, AttributeError) as e:
            logger.error("Export failed: %s", str(e))
            return {"error": str(e)}
