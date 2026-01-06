"""
Request Validators
Validation functions for API requests
"""

from typing import Dict, Any, Optional
import re


def validate_ingredients(ingredients: str) -> tuple[bool, Optional[str]]:
    """
    Validate ingredient list

    Args:
        ingredients: Ingredient text to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not ingredients:
        return False, "Ingredient list cannot be empty"

    if len(ingredients.strip()) < 10:
        return False, "Ingredient list seems too short (minimum 10 characters)"

    if len(ingredients) > 10000:
        return False, "Ingredient list too long (maximum 10000 characters)"

    return True, None


def validate_message(message: str) -> tuple[bool, Optional[str]]:
    """
    Validate chat message

    Args:
        message: Chat message to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not message:
        return False, "Message cannot be empty"

    if len(message.strip()) < 1:
        return False, "Message is too short"

    if len(message) > 5000:
        return False, "Message too long (maximum 5000 characters)"

    return True, None


def validate_question(question: str) -> tuple[bool, Optional[str]]:
    """
    Validate question text

    Args:
        question: Question to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not question:
        return False, "Question cannot be empty"

    if len(question.strip()) < 3:
        return False, "Question is too short"

    if len(question) > 1000:
        return False, "Question too long (maximum 1000 characters)"

    return True, None


def validate_context(context: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """
    Validate user context structure

    Args:
        context: User context dictionary

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(context, dict):
        return False, "Context must be a dictionary"

    # Context is optional, so empty dict is valid
    if not context:
        return True, None

    # Validate expected fields if present
    allowed_fields = {
        'healthConcerns', 'dietaryPreferences', 'allergens',
        'goals', 'confidence', 'recentProducts'
    }

    for key in context.keys():
        if key not in allowed_fields:
            return False, f"Unknown context field: {key}"

    # Validate list fields
    list_fields = ['healthConcerns', 'dietaryPreferences', 'allergens', 'goals']
    for field in list_fields:
        if field in context and not isinstance(context[field], list):
            return False, f"{field} must be a list"

    return True, None


def sanitize_text(text: str) -> str:
    """
    Sanitize text input

    Args:
        text: Text to sanitize

    Returns:
        Sanitized text
    """
    # Remove null bytes
    text = text.replace('\x00', '')

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    # Strip leading/trailing whitespace
    text = text.strip()

    return text


def validate_comparison_request(
    product1: str,
    product2: str
) -> tuple[bool, Optional[str]]:
    """
    Validate product comparison request

    Args:
        product1: First product ingredients
        product2: Second product ingredients

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Validate product 1
    is_valid, error = validate_ingredients(product1)
    if not is_valid:
        return False, f"Product 1: {error}"

    # Validate product 2
    is_valid, error = validate_ingredients(product2)
    if not is_valid:
        return False, f"Product 2: {error}"

    return True, None
