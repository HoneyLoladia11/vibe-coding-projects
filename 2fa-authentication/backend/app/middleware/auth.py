from typing import List
from fastapi import Depends, HTTPException, status
from app.models.user import User, UserRole
from app.utils.security import get_current_user


class RoleChecker:
    """Dependency for checking user roles"""
    
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, user: User = Depends(get_current_user)) -> User:
        """
        Check if user has required role
        
        Args:
            user: Current authenticated user
            
        Returns:
            User if authorized
            
        Raises:
            HTTPException: If user doesn't have required role
        """
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join([r.value for r in self.allowed_roles])}"
            )
        return user


# Predefined role checkers
require_admin = RoleChecker([UserRole.ADMIN])
require_moderator = RoleChecker([UserRole.MODERATOR, UserRole.ADMIN])
require_user = RoleChecker([UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN])
