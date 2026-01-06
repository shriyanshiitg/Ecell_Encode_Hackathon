"""
Helper Utilities
Common helper functions for analysis and processing
"""

from typing import List, Dict, Any
import re


def extract_ingredients(text: str) -> List[str]:
    """
    Extract individual ingredients from text

    Args:
        text: Raw ingredient text

    Returns:
        List of individual ingredients
    """
    # Common separators
    text = text.replace('\n', ',')
    text = text.replace(';', ',')

    # Split by comma
    ingredients = [i.strip() for i in text.split(',') if i.strip()]

    # Remove duplicates while preserving order
    seen = set()
    unique_ingredients = []
    for ingredient in ingredients:
        ingredient_lower = ingredient.lower()
        if ingredient_lower not in seen:
            seen.add(ingredient_lower)
            unique_ingredients.append(ingredient)

    return unique_ingredients


def count_ingredients(text: str) -> int:
    """
    Count number of ingredients in text

    Args:
        text: Raw ingredient text

    Returns:
        Number of ingredients
    """
    ingredients = extract_ingredients(text)
    return len(ingredients)


def categorize_ingredient(ingredient: str) -> str:
    """
    Categorize ingredient by type

    Args:
        ingredient: Ingredient name

    Returns:
        Category name
    """
    ingredient_lower = ingredient.lower()

    # Preservatives
    preservatives = [
        'benzoate', 'sorbate', 'sulfite', 'nitrite', 'nitrate',
        'bha', 'bht', 'tbhq', 'sodium benzoate', 'potassium sorbate'
    ]
    if any(p in ingredient_lower for p in preservatives):
        return 'preservative'

    # Sweeteners
    sweeteners = [
        'sugar', 'syrup', 'sucrose', 'fructose', 'glucose',
        'aspartame', 'sucralose', 'saccharin', 'stevia', 'xylitol',
        'corn syrup', 'high fructose'
    ]
    if any(s in ingredient_lower for s in sweeteners):
        return 'sweetener'

    # Colors
    colors = [
        'color', 'colour', 'dye', 'red 40', 'yellow 5',
        'blue 1', 'caramel color', 'tartrazine'
    ]
    if any(c in ingredient_lower for c in colors):
        return 'coloring'

    # Flavor enhancers
    enhancers = [
        'msg', 'monosodium glutamate', 'disodium guanylate',
        'disodium inosinate', 'yeast extract'
    ]
    if any(e in ingredient_lower for e in enhancers):
        return 'flavor_enhancer'

    # Emulsifiers
    emulsifiers = [
        'lecithin', 'mono', 'diglyceride', 'polysorbate',
        'carrageenan', 'xanthan', 'guar gum'
    ]
    if any(e in ingredient_lower for e in emulsifiers):
        return 'emulsifier'

    # Acids
    acids = [
        'citric acid', 'malic acid', 'ascorbic acid',
        'lactic acid', 'acetic acid'
    ]
    if any(a in ingredient_lower for a in acids):
        return 'acid'

    return 'other'


def detect_allergens(ingredients: str) -> List[str]:
    """
    Detect common allergens in ingredient list

    Args:
        ingredients: Ingredient text

    Returns:
        List of detected allergens
    """
    ingredients_lower = ingredients.lower()
    allergens = []

    allergen_keywords = {
        'milk': ['milk', 'dairy', 'whey', 'casein', 'lactose', 'butter', 'cheese', 'cream'],
        'eggs': ['egg', 'albumin', 'mayonnaise'],
        'fish': ['fish', 'anchovy', 'bass', 'cod', 'salmon', 'tuna'],
        'shellfish': ['shellfish', 'crab', 'lobster', 'shrimp', 'prawn'],
        'tree nuts': ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut'],
        'peanuts': ['peanut', 'groundnut'],
        'wheat': ['wheat', 'flour', 'gluten'],
        'soy': ['soy', 'soya', 'tofu', 'edamame']
    }

    for allergen, keywords in allergen_keywords.items():
        if any(keyword in ingredients_lower for keyword in keywords):
            allergens.append(allergen)

    return allergens


def estimate_processing_level(ingredients: List[str]) -> str:
    """
    Estimate food processing level based on ingredients

    Args:
        ingredients: List of ingredients

    Returns:
        Processing level: minimal, moderate, highly_processed
    """
    if len(ingredients) <= 5:
        return 'minimal'

    # Count artificial/processed ingredients
    processed_count = 0
    processed_keywords = [
        'modified', 'hydrogenated', 'artificial', 'enriched',
        'color', 'flavoring', 'preservative', 'emulsifier',
        'msg', 'syrup', 'concentrate'
    ]

    for ingredient in ingredients:
        ingredient_lower = ingredient.lower()
        if any(keyword in ingredient_lower for keyword in processed_keywords):
            processed_count += 1

    if processed_count >= 5:
        return 'highly_processed'
    elif processed_count >= 2:
        return 'moderate'
    else:
        return 'minimal'


def format_analysis_summary(analysis: Dict[str, Any]) -> str:
    """
    Format analysis into human-readable summary

    Args:
        analysis: Analysis result dictionary

    Returns:
        Formatted summary text
    """
    summary_parts = []

    if 'overallAssessment' in analysis and analysis['overallAssessment']:
        assessment = analysis['overallAssessment']
        summary_parts.append(f"Verdict: {assessment.get('verdict', 'N/A')}")

    if 'healthConcerns' in analysis and analysis['healthConcerns']:
        concerns = analysis['healthConcerns']
        summary_parts.append(f"Found {len(concerns)} health concern(s)")

    if 'tradeOffs' in analysis and analysis['tradeOffs']:
        tradeoffs = analysis['tradeOffs']
        summary_parts.append(f"Identified {len(tradeoffs)} trade-off(s)")

    return " | ".join(summary_parts) if summary_parts else "Analysis complete"


def merge_user_context(
    existing_context: Dict[str, Any],
    new_context: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Merge new context into existing context

    Args:
        existing_context: Current user context
        new_context: New context to merge

    Returns:
        Merged context
    """
    merged = existing_context.copy() if existing_context else {}

    # Merge list fields (remove duplicates)
    list_fields = ['healthConcerns', 'dietaryPreferences', 'allergens', 'goals']

    for field in list_fields:
        if field in new_context:
            existing_items = set(merged.get(field, []))
            new_items = set(new_context[field])
            merged[field] = list(existing_items | new_items)

    # Update confidence (take highest)
    if 'confidence' in new_context:
        existing_conf = merged.get('confidence', 'low')
        new_conf = new_context['confidence']

        confidence_levels = {'low': 1, 'medium': 2, 'high': 3}
        if confidence_levels.get(new_conf, 0) > confidence_levels.get(existing_conf, 0):
            merged['confidence'] = new_conf

    return merged
