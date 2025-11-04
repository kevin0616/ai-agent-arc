"""
Cache Service - Caching layer (using in-memory cache for now)
"""
from typing import Optional, Any
import json
from datetime import datetime, timedelta


class CacheService:
    """Service for caching operations"""
    
    def __init__(self):
        """Initialize cache service"""
        # In production, use Redis
        self.cache: dict = {}
        self.expiry: dict = {}
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None
        """
        if key not in self.cache:
            return None
        
        # Check expiry
        if key in self.expiry:
            if datetime.now() > self.expiry[key]:
                del self.cache[key]
                del self.expiry[key]
                return None
        
        return self.cache[key]
    
    def set(self, key: str, value: Any, ttl: int = 300):
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (default 5 minutes)
        """
        self.cache[key] = value
        self.expiry[key] = datetime.now() + timedelta(seconds=ttl)
    
    def delete(self, key: str):
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
        if key in self.expiry:
            del self.expiry[key]
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
        self.expiry.clear()

