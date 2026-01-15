from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime
from app.models.tool import ToolCategory, ToolStatus


class ToolCreate(BaseModel):
    """Schema for creating a new tool"""
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=10)
    category: ToolCategory
    url: Optional[str] = None


class ToolUpdate(BaseModel):
    """Schema for updating a tool"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[ToolCategory] = None
    url: Optional[str] = None


class ToolResponse(BaseModel):
    """Schema for tool response - matches Tool model exactly"""
    id: int
    name: str
    description: str
    category: ToolCategory
    status: ToolStatus
    url: Optional[str] = None
    created_by: int
    approved_by: Optional[int] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ToolDetailResponse(ToolResponse):
    """Extended response with computed fields for detail views"""
    created_by_username: Optional[str] = None
    approved_by_username: Optional[str] = None
    average_rating: Optional[float] = None
    total_ratings: int = 0
    user_rating: Optional[int] = None  # Current user's rating
    total_comments: int = 0


class ToolFilter(BaseModel):
    """Schema for filtering tools"""
    category: Optional[ToolCategory] = None
    status: Optional[ToolStatus] = None
    created_by: Optional[int] = None


class ToolApproval(BaseModel):
    """Schema for approving/rejecting a tool"""
    approved: bool
    reason: Optional[str] = None


class ToolsListResponse(BaseModel):
    """Schema for paginated tools list"""
    tools: list[ToolResponse]
    total: int
    skip: int
    limit: int
