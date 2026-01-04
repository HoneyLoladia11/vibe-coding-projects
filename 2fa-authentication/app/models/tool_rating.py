from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class ToolRating(Base):
    """Tool rating model - users can rate tools 1-5 stars"""
    __tablename__ = "tool_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tool = relationship("Tool", back_populates="ratings")
    user = relationship("User", back_populates="ratings")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('tool_id', 'user_id', name='unique_user_tool_rating'),
        CheckConstraint('rating >= 1 AND rating <= 5', name='valid_rating'),
    )
    
    def __repr__(self):
        return f"<ToolRating(tool_id={self.tool_id}, user_id={self.user_id}, rating={self.rating})>"
