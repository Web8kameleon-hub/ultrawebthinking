"""
JONA Interfaces Module - Abstract interfaces for components
"""

from jona.interfaces.albi_interface import ALBIInterface, RealALBI
from jona.interfaces.alba_interface import ALBAInterface, RealALBA
from jona.interfaces.eeg_interface import EEGInterface, RealEEG

__all__ = [
    'ALBIInterface', 'RealALBI',
    'ALBAInterface', 'RealALBA',
    'EEGInterface', 'RealEEG'
]
