"""
API endpoints for the Azure solutions assistant.
"""

from typing import Any, Dict
from pathlib import Path

from fastapi import Body, Query
from fastapi.responses import JSONResponse, FileResponse

from schemas.models import TextResponse, DiagramResponse, DiagramSummary
from services.azure_openai import azure_openai_service
from services.diagram import diagram_service


async def chat_endpoint(
    payload: Dict[str, Any] = Body(...), 
    download: bool = Query(False, description="If true and a diagram is generated, return the PNG file as attachment")
):
    """
    Main chat endpoint for handling user queries.
    
    Args:
        payload: Request payload containing the user prompt
        download: Whether to return diagram as direct download
        
    Returns:
        JSON response with text or diagram content, or direct file download
    """
    # Validate request
    prompt = (payload.get("prompt") or "").strip()
    if not prompt:
        return JSONResponse({"error": "Field 'prompt' is required"}, status_code=400)
    
    try:
        # Get response from Azure OpenAI
        completion = azure_openai_service.create_chat_completion(prompt)
        message = completion.choices[0].message
        
        # Handle tool calls (diagrams)
        if getattr(message, "tool_calls", None):
            return await _handle_diagram_tool_call(message.tool_calls[0], download)
        
        # Handle text content with potential embedded diagram specs
        content = message.content or ""
        diagram_spec = diagram_service.extract_spec_from_text(content)
        
        if diagram_spec:
            return await _handle_diagram_from_content(diagram_spec, content, download)
        
        # Return plain text response
        return TextResponse(answer=content or "OK")
    
    except Exception as e:
        return JSONResponse(
            {"error": f"Internal server error: {str(e)}"}, 
            status_code=500
        )


async def download_endpoint(filename: str):
    """
    Endpoint for downloading generated diagram files.
    
    Args:
        filename: Name of the file to download
        
    Returns:
        File response with the requested diagram
    """
    file_path = Path("static/diagrams") / filename
    if not file_path.exists():
        return JSONResponse({"error": "File not found"}, status_code=404)
    
    return FileResponse(
        str(file_path), 
        media_type="image/png", 
        filename=filename
    )


async def _handle_diagram_tool_call(tool_call: Any, download: bool) -> Any:
    """
    Handle diagram generation from tool call.
    
    Args:
        tool_call: The tool call object from OpenAI
        download: Whether to return file as download
        
    Returns:
        Diagram response or file download
    """
    # Extract tool arguments
    spec = azure_openai_service.extract_tool_call_args(tool_call)
    if not spec:
        return JSONResponse(
            {"error": "Invalid tool arguments JSON"}, 
            status_code=500
        )
    
    # Render diagram
    result = diagram_service.render_diagram(spec)
    if not result.get("ok"):
        return JSONResponse(
            {"error": result.get("error", "Failed to render diagram")}, 
            status_code=500
        )
    
    # Return file download if requested
    png_path = result["path"]
    filename = Path(png_path).name
    if download:
        return FileResponse(png_path, media_type="image/png", filename=filename)
    
    # Return diagram response
    return DiagramResponse(
        url=result["url"],
        download=f"/download/{filename}",
        summary=DiagramSummary(**result["summary"])
    )


async def _handle_diagram_from_content(spec: Dict[str, Any], content: str, download: bool) -> Any:
    """
    Handle diagram generation from content parsing.
    
    Args:
        spec: Extracted diagram specification
        content: Original content containing the spec
        download: Whether to return file as download
        
    Returns:
        Diagram response or file download
    """
    # Render diagram
    result = diagram_service.render_diagram(spec)
    if not result.get("ok"):
        return JSONResponse(
            {"error": result.get("error", "Failed to render diagram")}, 
            status_code=500
        )
    
    # Return file download if requested
    png_path = result["path"]
    filename = Path(png_path).name
    if download:
        return FileResponse(png_path, media_type="image/png", filename=filename)
    
    # Return diagram response with raw content
    return DiagramResponse(
        url=result["url"],
        download=f"/download/{filename}",
        summary=DiagramSummary(**result["summary"]),
        raw=content,
        saved=str(Path("api_diagrams") / filename)
    )