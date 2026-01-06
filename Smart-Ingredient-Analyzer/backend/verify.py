#!/usr/bin/env python3
"""
Verification script for Python backend
Tests all imports and basic functionality
"""

import sys


def test_imports():
    """Test that all modules can be imported"""
    print("🔍 Testing imports...")

    try:
        # Config
        from config.settings import settings, validate_settings
        print("✅ Config imports successful")

        # Services
        from services.groq_service import GroqService
        from services.context_service import ContextService
        print("✅ Service imports successful")

        # Utils
        from utils.cache import analysis_cache, context_cache, SimpleCache
        from utils import validators, helpers
        print("✅ Utility imports successful")

        # FastAPI
        from fastapi import FastAPI
        import uvicorn
        import httpx
        from pydantic import BaseModel
        print("✅ FastAPI imports successful")

        return True

    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False


def test_settings():
    """Test settings configuration"""
    print("\n🔍 Testing settings...")

    try:
        from config.settings import settings

        print(f"  - GROQ_MODEL: {settings.GROQ_MODEL}")
        print(f"  - PORT: {settings.PORT}")
        print(f"  - NODE_ENV: {settings.NODE_ENV}")
        print(f"  - API Key configured: {bool(settings.GROQ_API_KEY)}")

        if not settings.GROQ_API_KEY:
            print("⚠️  Warning: GROQ_API_KEY not set")
            return False

        print("✅ Settings configured correctly")
        return True

    except Exception as e:
        print(f"❌ Settings error: {e}")
        return False


def test_services():
    """Test service initialization"""
    print("\n🔍 Testing service initialization...")

    try:
        from services.groq_service import GroqService
        from services.context_service import ContextService

        groq = GroqService()
        context = ContextService()

        print("✅ Services initialized successfully")
        return True

    except Exception as e:
        print(f"❌ Service initialization error: {e}")
        return False


def test_validators():
    """Test validator functions"""
    print("\n🔍 Testing validators...")

    try:
        from utils import validators

        # Test ingredient validation
        is_valid, error = validators.validate_ingredients("Sugar, Water, Salt")
        assert is_valid, "Valid ingredients should pass"

        is_valid, error = validators.validate_ingredients("Short")
        assert not is_valid, "Short ingredients should fail"

        # Test message validation
        is_valid, error = validators.validate_message("Hello!")
        assert is_valid, "Valid message should pass"

        is_valid, error = validators.validate_message("")
        assert not is_valid, "Empty message should fail"

        print("✅ Validators working correctly")
        return True

    except Exception as e:
        print(f"❌ Validator error: {e}")
        return False


def test_cache():
    """Test cache functionality"""
    print("\n🔍 Testing cache...")

    try:
        from utils.cache import SimpleCache

        cache = SimpleCache(ttl_seconds=60)

        # Test set and get
        cache.set("test_key", {"data": "value"})
        result = cache.get("test_key")

        assert result is not None, "Cache should return value"
        assert result["data"] == "value", "Cache should return correct value"

        # Test stats
        stats = cache.stats()
        assert stats["total_entries"] >= 1, "Cache should have entries"

        print("✅ Cache working correctly")
        return True

    except Exception as e:
        print(f"❌ Cache error: {e}")
        return False


def test_helpers():
    """Test helper functions"""
    print("\n🔍 Testing helpers...")

    try:
        from utils import helpers

        # Test ingredient extraction
        ingredients = helpers.extract_ingredients("Sugar, Salt, Water")
        assert len(ingredients) == 3, "Should extract 3 ingredients"

        # Test allergen detection
        allergens = helpers.detect_allergens("Contains milk and peanuts")
        assert "milk" in allergens, "Should detect milk allergen"
        assert "peanuts" in allergens, "Should detect peanut allergen"

        print("✅ Helpers working correctly")
        return True

    except Exception as e:
        print(f"❌ Helper error: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("Python Backend Verification")
    print("=" * 60)

    tests = [
        test_imports,
        test_settings,
        test_services,
        test_validators,
        test_cache,
        test_helpers,
    ]

    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append(False)

    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)

    passed = sum(results)
    total = len(results)

    print(f"Tests passed: {passed}/{total}")

    if passed == total:
        print("✅ All tests passed! Backend is ready to run.")
        print("\nTo start the server:")
        print("  uvicorn main:app --reload --port 5001")
        return 0
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
