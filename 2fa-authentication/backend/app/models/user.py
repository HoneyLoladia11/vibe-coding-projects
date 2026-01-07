from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Role and permissions
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    
    # 2FA settings
    telegram_chat_id = Column(String(100), nullable=True)
    is_2fa_enabled = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    tools = relationship("Tool", back_populates="creator", foreign_keys="Tool.created_by")
    approved_tools = relationship("Tool", back_populates="approver", foreign_keys="Tool.approved_by")
    audit_logs = relationship("AuditLog", back_populates="user")
    ratings = relationship("ToolRating", back_populates="user")
    comments = relationship("ToolComment", back_populates="user")
    comment_votes = relationship("CommentVote", back_populates="user")
    
    def __repr__(self):
        return f"<User(username='{self.username}', role='{self.role}')>"
