# Azure OpenAI Diagram Service

A professional FastAPI application that generates Azure architecture diagrams using Azure OpenAI and mingrammer/diagrams.

## 🏗️ Project Structure

```
fastapi-backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables (create this)
│
├── api/                   # API layer
│   ├── __init__.py
│   └── endpoints.py       # Request handlers
│
├── config/                # Configuration
│   ├── __init__.py
│   ├── settings.py        # Application settings
│   └── prompts.py         # System prompts
│
├── schemas/               # Data models
│   ├── __init__.py
│   ├── models.py          # Pydantic models
│   └── tools.py           # Tool definitions
│
├── services/              # Business logic
│   ├── __init__.py
│   ├── azure_openai.py    # Azure OpenAI service
│   └── diagram.py         # Diagram rendering service
│
└── static/                # Static files
    └── diagrams/          # Generated diagrams
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_API_KEY=your_key
   AZURE_OPENAI_API_VERSION=2024-12-01-preview
   AZURE_OPENAI_DEPLOYMENT=gpt-5-chat
   DEBUG=true
   ```

3. **Run the application:**
   ```bash
   python main.py
   ```
   or
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

4. **Access the API:**
   - API: http://127.0.0.1:8000
   - Documentation: http://127.0.0.1:8000/docs
   - Health check: `GET /`
   - Chat: `POST /chat`
   - Download: `GET /download/{filename}`

## 📡 API Endpoints

### POST /chat
Generate responses and diagrams based on user prompts.

**Request:**
```json
{
  "prompt": "Design an Azure RAG solution with AI Search"
}
```

**Responses:**

*Text Response:*
```json
{
  "type": "text",
  "answer": "Here's how to implement RAG on Azure..."
}
```

*Diagram Response:*
```json
{
  "type": "diagram",
  "answer": "Diagram generated.",
  "url": "/static/diagrams/azure_arch_1234567890.png",
  "download": "/download/azure_arch_1234567890.png",
  "summary": {
    "title": "Azure RAG Solution",
    "direction": "LR",
    "nodes": 7,
    "edges": 8,
    "clusters": 4
  }
}
```

### GET /download/{filename}
Download generated diagram files directly.

## 🔧 Configuration

The application uses environment variables for configuration. See `config/settings.py` for all available options:

- `AZURE_OPENAI_*`: Azure OpenAI service configuration
- `DEBUG`: Enable debug mode and API documentation
- `MAX_NODES`, `MAX_EDGES`: Diagram complexity limits
- `DIAGRAM_OUTPUT_DIR`: Directory for generated diagrams

## 🏭 Production Deployment

1. **Set environment variables appropriately:**
   - Set `DEBUG=false` for production
   - Configure CORS origins in `main.py`
   - Use proper secrets management

2. **Use a production WSGI server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

3. **Set up proper monitoring and logging**

## 🧪 Development

The modular structure makes it easy to:
- Add new endpoints in `api/endpoints.py`
- Modify system prompts in `config/prompts.py`
- Extend diagram functionality in `services/diagram.py`
- Add new response models in `schemas/models.py`

## 📚 Key Features

- **Modular Architecture**: Clean separation of concerns
- **Type Safety**: Full Pydantic validation and type hints
- **Error Handling**: Comprehensive error responses
- **Configuration**: Environment-based configuration
- **Documentation**: Auto-generated OpenAPI docs
- **Static Files**: Serves generated diagrams
- **Professional Structure**: Production-ready codebase