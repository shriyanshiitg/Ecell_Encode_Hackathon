"""
Cache Utility
Simple in-memory caching for API responses
"""

from typing import Any, Optional
from datetime import datetime, timedelta
import hashlib
import json


class SimpleCache:
    """Simple in-memory cache with TTL support"""

    def __init__(self, ttl_seconds: int = 300):
        """
        Initialize cache

        Args:
            ttl_seconds: Time to live in seconds (default 5 minutes)
        """
        self.cache = {}
        self.ttl_seconds = ttl_seconds

    def _generate_key(self, data: Any) -> str:
        """Generate cache key from data"""
        json_str = json.dumps(data, sort_keys=True)
        return hashlib.md5(json_str.encode()).hexdigest()

    def get(self, key_data: Any) -> Optional[Any]:
        """
        Get value from cache

        Args:
            key_data: Data to generate cache key from

        Returns:
            Cached value if exists and not expired, None otherwise
        """
        key = self._generate_key(key_data)

        if key not in self.cache:
            return None

        entry = self.cache[key]

        # Check if expired
        if datetime.now() > entry['expires']:
            del self.cache[key]
            return None

        return entry['value']

    def set(self, key_data: Any, value: Any) -> None:
        """
        Set value in cache

        Args:
            key_data: Data to generate cache key from
            value: Value to cache
        """
        key = self._generate_key(key_data)

        self.cache[key] = {
            'value': value,
            'expires': datetime.now() + timedelta(seconds=self.ttl_seconds)
        }

    def clear(self) -> None:
        """Clear all cache entries"""
        self.cache.clear()

    def cleanup_expired(self) -> int:
        """
        Remove expired entries

        Returns:
            Number of entries removed
        """
        now = datetime.now()
        expired_keys = [
            key for key, entry in self.cache.items()
            if now > entry['expires']
        ]

        for key in expired_keys:
            del self.cache[key]

        return len(expired_keys)

    def stats(self) -> dict:
        """Get cache statistics"""
        total = len(self.cache)
        now = datetime.now()
        expired = sum(1 for entry in self.cache.values() if now > entry['expires'])

        return {
            'total_entries': total,
            'valid_entries': total - expired,
            'expired_entries': expired
        }


# Global cache instances
analysis_cache = SimpleCache(ttl_seconds=300)  # 5 minutes
context_cache = SimpleCache(ttl_seconds=600)   # 10 minutes
