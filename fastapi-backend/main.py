"""
Azure OpenAI Diagram Service - FastAPI Application
A professional, modular FastAPI application for generating Azure architecture diagrams.
"""

from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from api.endpoints import chat_endpoint, download_endpoint


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application instance
    """
    # Validate configuration
    settings.validate()
    
    # Create FastAPI app
    app = FastAPI(
        title="Azure OpenAI Diagram Service",
        description="Generate Azure architecture diagrams using AI and mingrammer/diagrams",
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Ensure static directory exists
    static_path = Path(settings.DIAGRAM_OUTPUT_DIR)
    static_path.mkdir(parents=True, exist_ok=True)
    
    # Mount static files
    app.mount("/static", StaticFiles(directory="static"), name="static")
    
    # Register routes
    app.post("/chat", summary="Chat with Azure AI Assistant")(chat_endpoint)
    app.get("/download/{filename}", summary="Download generated diagram")(download_endpoint)
    
    # Root endpoint
    @app.get("/", summary="API Health Check")
    async def root():
        """API health check endpoint."""
        return {
            "ok": True, 
            "service": "Azure OpenAI Diagram Service",
            "version": "1.0.0",
            "message": "POST /chat with {'prompt': 'your question'}"
        }
    
    return app


# Create the application instance
app = create_application()


if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting Azure OpenAI Diagram Service...")
    print(f"📊 Diagram output directory: {settings.DIAGRAM_OUTPUT_DIR}")
    print(f"🔧 Debug mode: {settings.DEBUG}")
    
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )