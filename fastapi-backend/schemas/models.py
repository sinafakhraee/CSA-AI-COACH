"""
Request and response models for the API.
"""

from typing import Optional, Union
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    prompt: str = Field(..., description="User prompt/question", min_length=1)


class TextResponse(BaseModel):
    """Response model for text-based answers."""
    type: str = Field(default="text", description="Response type")
    answer: str = Field(..., description="Assistant's text response")


class DiagramSummary(BaseModel):
    """Summary information for generated diagrams."""
    title: str = Field(..., description="Diagram title")
    direction: str = Field(..., description="Graph layout direction")
    nodes: int = Field(..., description="Number of nodes in the diagram")
    edges: int = Field(..., description="Number of edges in the diagram")
    clusters: int = Field(..., description="Number of clusters in the diagram")


class DiagramResponse(BaseModel):
    """Response model for diagram-based answers."""
    type: str = Field(default="diagram", description="Response type")
    answer: str = Field(default="Diagram generated.", description="Status message")
    url: str = Field(..., description="URL to access the generated diagram")
    download: str = Field(..., description="Download URL for the diagram")
    summary: Optional[DiagramSummary] = Field(None, description="Diagram summary information")
    raw: Optional[str] = Field(None, description="Raw tool call content (for debugging)")
    saved: Optional[str] = Field(None, description="Local file path where diagram is saved")


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error message")


# Union type for all possible responses
ChatResponse = Union[TextResponse, DiagramResponse]