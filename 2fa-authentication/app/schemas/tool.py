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
    """Schema for tool response"""
    id: int
    name: str
    description: str
    category: ToolCategory
    status: ToolStatus
    url: Optional[str]
    created_by: int
    approved_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ToolFilter(BaseModel):
    """Schema for filtering tools"""
    category: Optional[ToolCategory] = None
    status: Optional[ToolStatus] = None
    created_by: Optional[int] = None


class ToolApproval(BaseModel):
    """Schema for approving/rejecting a tool"""
    approved: bool
    reason: Optional[str] = None
