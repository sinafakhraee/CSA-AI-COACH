"""
Application configuration and settings.
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """Application settings and configuration."""
    
    # Azure OpenAI Configuration
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_API_KEY: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_API_VERSION: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
    AZURE_OPENAI_DEPLOYMENT: str = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5-chat")
    
    # Application Configuration
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    MAX_NODES: int = int(os.getenv("MAX_NODES", "60"))
    MAX_EDGES: int = int(os.getenv("MAX_EDGES", "120"))
    DIAGRAM_OUTPUT_DIR: str = os.getenv("DIAGRAM_OUTPUT_DIR", "static/diagrams")
    
    # Icon Configuration
    FALLBACK_ICON: str = "diagrams.azure.general.Resource"
    ANNOTATE_FALLBACK: bool = True
    ALLOWED_ICON_PREFIXES: tuple = ("diagrams.azure.", "diagrams.onprem.")
    
    @classmethod
    def validate(cls) -> None:
        """Validate required settings."""
        required_settings = [
            "AZURE_OPENAI_ENDPOINT",
            "AZURE_OPENAI_API_KEY",
        ]
        
        missing = []
        for setting in required_settings:
            if not getattr(cls, setting):
                missing.append(setting)
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")


# Global settings instance
settings = Settings()