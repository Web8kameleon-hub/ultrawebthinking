"""
JONA Exception Definitions
"""


class JONAException(Exception):
    """Base JONA exception"""
    pass


class JONASystemError(JONAException):
    """JONA system error"""
    pass


class JONAConfigurationError(JONAException):
    """JONA configuration error"""
    pass


class JONAInitializationError(JONAException):
    """JONA initialization error"""
    pass
