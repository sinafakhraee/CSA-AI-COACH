"""
Tool definitions for Azure OpenAI function calling.
"""

from typing import Dict, Any, List


def get_diagram_tool_definition() -> List[Dict[str, Any]]:
    """Get the diagram rendering tool definition for Azure OpenAI."""
    return [
        {
            "type": "function",
            "function": {
                "name": "render_azure_architecture",
                "description": (
                    "Render an Azure architecture diagram using mingrammer/diagrams from a structured spec. "
                    "Call this when the user asks for an Azure architecture/diagram/visual/drawing."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Diagram title. Keep it short."},
                        "direction": {
                            "type": "string",
                            "enum": ["LR", "TB", "RL", "BT"],
                            "description": "Graph layout direction (default LR)."
                        },
                        "clusters": {
                            "type": "array",
                            "description": "Optional cluster groups for organizing nodes.",
                            "items": {
                                "type": "object",
                                "properties": {"id": {"type": "string"}, "label": {"type": "string"}},
                                "required": ["id"]
                            }
                        },
                        "nodes": {
                            "type": "array",
                            "description": (
                                "Nodes to draw. Each node.icon MUST be a diagrams class path like "
                                "'diagrams.azure.web.AppServices', 'diagrams.azure.database.SQLDatabases', "
                                "'diagrams.azure.ml.AzureOpenAI', or 'diagrams.onprem.client.User'."
                            ),
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "label": {"type": "string"},
                                    "icon": {"type": "string"},
                                    "cluster": {"type": "string"}
                                },
                                "required": ["id", "icon"]
                            }
                        },
                        "edges": {
                            "type": "array",
                            "description": "Connections between nodes.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "source": {"type": "string"},
                                    "target": {"type": "string"},
                                    "label": {"type": "string"}
                                },
                                "required": ["source", "target"]
                            }
                        }
                    },
                    "required": ["nodes"]
                }
            }
        }
    ]