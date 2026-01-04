from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserCreate(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    username: str
    email: str
    role: UserRole
    is_2fa_enabled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TelegramSetup(BaseModel):
    """Schema for setting up Telegram 2FA"""
    telegram_chat_id: str


class TwoFactorVerify(BaseModel):
    """Schema for verifying 2FA code"""
    code: str = Field(..., min_length=6, max_length=6)


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    requires_2fa: Optional[bool] = False


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
