from django.core.cache import cache
from functools import wraps
from dotenv import load_dotenv
import os

load_dotenv()


class CacheService:
    ENABLE_LOGGING = os.getenv("CACHE_LOGGING", "False").lower() == "true"

    @staticmethod
    def log(msg: str):
        if CacheService.ENABLE_LOGGING:
            print(f"[CACHE] {msg}")

    @staticmethod
    def build_key(key, prefix, *args, **kwargs):
        base = key(*args, **kwargs) if callable(key) else key
        return f"{prefix}:{base}" if prefix else base

    @staticmethod
    def get(key):
        val = cache.get(key)
        CacheService.log(f"GET {'HIT' if val else 'MISS'} → {key}")
        return val

    @staticmethod
    def set(key, value, ttl=300):
        cache.set(key, value, ttl)
        CacheService.log(f"SET → {key} (TTL={ttl}s)")

    @staticmethod
    def delete(key):
        cache.delete(key)
        CacheService.log(f"DELETE → {key}")

    @staticmethod
    def cache(key, ttl=300, prefix=None):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                actual_key = CacheService.build_key(key, prefix, *args, **kwargs)
                cached = CacheService.get(actual_key)
                if cached is not None:
                    return cached
                result = func(*args, **kwargs)
                CacheService.set(actual_key, result, ttl)
                return result

            return wrapper

        return decorator

    @staticmethod
    def invalidate(keys, prefix=None):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                result = func(*args, **kwargs)

                keys_to_invalidate = keys if isinstance(keys, list) else [keys]
                for key in keys_to_invalidate:
                    actual_key = CacheService.build_key(key, prefix, *args, **kwargs)
                    CacheService.delete(actual_key)

                return result

            return wrapper

        return decorator
