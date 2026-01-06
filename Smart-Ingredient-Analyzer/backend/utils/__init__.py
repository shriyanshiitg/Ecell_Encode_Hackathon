"""
Utility modules for Smart Food Analyzer
"""

from .cache import analysis_cache, context_cache, SimpleCache
from .validators import (
    validate_ingredients,
    validate_message,
    validate_question,
    validate_context,
    validate_comparison_request,
    sanitize_text
)
from .helpers import (
    extract_ingredients,
    count_ingredients,
    categorize_ingredient,
    detect_allergens,
    estimate_processing_level,
    format_analysis_summary,
    merge_user_context
)

__all__ = [
    # Cache
    'analysis_cache',
    'context_cache',
    'SimpleCache',

    # Validators
    'validate_ingredients',
    'validate_message',
    'validate_question',
    'validate_context',
    'validate_comparison_request',
    'sanitize_text',

    # Helpers
    'extract_ingredients',
    'count_ingredients',
    'categorize_ingredient',
    'detect_allergens',
    'estimate_processing_level',
    'format_analysis_summary',
    'merge_user_context',
]
