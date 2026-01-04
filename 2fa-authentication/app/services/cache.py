import json
from typing import Optional, Any
import redis
from app.config import get_settings

settings = get_settings()


class CacheService:
    """Service for handling Redis caching operations"""
    
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                db=settings.redis_db,
                decode_responses=True
            )
            # Test connection
            self.redis_client.ping()
        except redis.ConnectionError:
            print("Warning: Redis connection failed. Caching will be disabled.")
            self.redis_client = None
    
    def set(self, key: str, value: Any, expire: int = 300) -> bool:
        """
        Set a value in cache
        
        Args:
            key: Cache key
            value: Value to cache (will be JSON serialized)
            expire: Expiration time in seconds (default 5 minutes)
            
        Returns:
            bool: True if successful
        """
        if not self.redis_client:
            return False
        
        try:
            serialized_value = json.dumps(value)
            self.redis_client.setex(key, expire, serialized_value)
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        if not self.redis_client:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """
        Delete a value from cache
        
        Args:
            key: Cache key
            
        Returns:
            bool: True if successful
        """
        if not self.redis_client:
            return False
        
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    def clear_pattern(self, pattern: str) -> bool:
        """
        Clear all keys matching a pattern
        
        Args:
            pattern: Pattern to match (e.g., "tools:*")
            
        Returns:
            bool: True if successful
        """
        if not self.redis_client:
            return False
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            return True
        except Exception as e:
            print(f"Cache clear pattern error: {e}")
            return False


# Singleton instance
cache_service = CacheService()
