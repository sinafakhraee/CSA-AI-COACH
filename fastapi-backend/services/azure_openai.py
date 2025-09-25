"""
Azure OpenAI service for handling chat completions and tool calls.
"""

import json
from typing import Dict, Any, Optional
from openai import AzureOpenAI

from config.settings import settings
from config.prompts import SYSTEM_PROMPT
from schemas.tools import get_diagram_tool_definition


class AzureOpenAIService:
    """Service for handling Azure OpenAI interactions."""
    
    def __init__(self):
        """Initialize the Azure OpenAI client."""
        self.client = AzureOpenAI(
            api_key=settings.AZURE_OPENAI_API_KEY,
            api_version=settings.AZURE_OPENAI_API_VERSION,
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
        )
        self.tools = get_diagram_tool_definition()
    
    def create_chat_completion(
        self, 
        user_prompt: str, 
        temperature: float = 0.2
    ) -> Any:
        """
        Create a chat completion with Azure OpenAI.
        
        Args:
            user_prompt: The user's prompt/question
            temperature: Sampling temperature for response generation
            
        Returns:
            The completion response from Azure OpenAI
        """
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ]
        
        return self.client.chat.completions.create(
            model=settings.AZURE_OPENAI_DEPLOYMENT,
            messages=messages,
            tools=self.tools,
            tool_choice="auto",
            temperature=temperature,
        )
    
    def extract_tool_call_args(self, tool_call: Any) -> Optional[Dict[str, Any]]:
        """
        Extract and parse tool call arguments.
        
        Args:
            tool_call: The tool call object from OpenAI response
            
        Returns:
            Parsed arguments as a dictionary, or None if parsing fails
        """
        try:
            args_json = tool_call.function.arguments or "{}"
            return json.loads(args_json)
        except json.JSONDecodeError:
            return None


# Global service instance
azure_openai_service = AzureOpenAIService()