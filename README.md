# 🚀 Azure Live Avatar Solution Assistant

A sample demonstrating how to build a live avatar to assist in designing solutions on Azure using AI-powered conversation and architecture diagram generation.

## 🎥 Application Demo

[![Watch the Demo](https://img.youtube.com/vi/xx1HzRn4yuo/hqdefault.jpg)](https://www.youtube.com/watch?v=xx1HzRn4yuo)

## 📁 Solution Architecture

```
CSA-AI-Coach/
├── react-avatar-chat/          # React.js Frontend Application
│   ├── src/
│   │   ├── components/         # UI Components (Avatar, Controls, Chat)
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── JobSetupPanel.tsx
│   │   │   └── VideoContainer.tsx
│   │   ├── hooks/             # Custom React Hooks
│   │   │   └── useAvatarService.ts
│   │   └── types/             # TypeScript Type Definitions
│   │       └── speech.ts
│   ├── public/                # Static Assets
│   ├── build/                 # Production Build Output
│   └── package.json
├── fastapi-backend/           # Python FastAPI Backend Service (Refactored)
│   ├── main.py               # Application Entry Point
│   ├── config/               # Configuration & Settings
│   │   ├── settings.py       # Environment Configuration
│   │   └── prompts.py        # AI System Prompts
│   ├── api/                  # API Endpoints
│   │   └── endpoints.py      # Request Handlers
│   ├── services/             # Business Logic Services
│   │   ├── azure_openai.py   # Azure OpenAI Integration
│   │   └── diagram.py        # Diagram Rendering Service
│   ├── schemas/              # Data Models & Validation
│   │   ├── models.py         # Pydantic Models
│   │   └── tools.py          # Function Calling Definitions
│   ├── static/diagrams/      # Generated Architecture Diagrams
│   ├── requirements.txt      # Python Dependencies
│   └── README.md            # Backend Documentation
└── README.md                # This file
```

## ✨ Features

### 🎭 Frontend (React Avatar Chat)
- **AI Avatar Integration**: Interactive conversation with Lisa avatar in casual-sitting pose
- **Multi-language Speech Recognition**: Support for 8 languages (EN, DE, ES, FR, IT, JA, KO, ZH)
- **Real-time Streaming Chat**: Server-sent events for live response streaming
- **Responsive Design**: Professional gradient UI that works on desktop and mobile
- **Flexible Input Methods**: Voice and text input options
- **Session Management**: Persistent conversation history maintained server-side

### 🧠 Backend (FastAPI Service)
- **Azure OpenAI Integration**: GPT-5-chat model with function calling
- **Architecture Diagram Generation**: Automatic Azure solution diagrams using mingrammer/diagrams
- **Session-based Chat History**: Server-side conversation memory and context management
- **Streaming Response Support**: Real-time token streaming via Server-Sent Events
- **RESTful API Design**: Clean endpoints for chat, sessions, and diagram generation
- **Modular Architecture**: Professional code organization with separation of concerns

### 🎯 AI Capabilities
- **Azure Cloud Solution Coaching**: Expert guidance on Azure services and architectures
- **Intelligent Diagram Generation**: Automatic creation of Azure architecture diagrams
- **Context-aware Conversations**: Maintains project details and conversation history
- **Function Calling**: Advanced AI tool usage for diagram rendering

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** for React frontend
- **Python 3.9+** for FastAPI backend
- **Modern web browser** with WebRTC support
- **Azure AI Foundry** with the following services:
  - **Azure OpenAI Service** (GPT-4 or GPT-5 deployment)
  - **Azure Speech Service** for voice synthesis and recognition
  - **Azure Avatar Service** for real-time avatar interactions

### 🔧 Backend Setup (FastAPI)

1. **Navigate to backend directory:**
   ```bash
   cd fastapi-backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in `fastapi-backend/` directory:
   ```env
   AZURE_OPENAI_API_KEY=your_azure_openai_api_key
   AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT=gpt-5-chat
   AZURE_OPENAI_API_VERSION=2024-12-01-preview
   DEBUG=true
   ```

5. **Start the FastAPI server:**
   ```bash
   # Using the refactored modular structure
   uvicorn main:app --reload --port 8000
   
   # OR using Python directly
   python main.py
   ```
   
   The backend API will be available at `http://localhost:8000`

### 🎨 Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd react-avatar-chat
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Update configuration** (if needed):
   The frontend is pre-configured to connect to `http://localhost:8000` for the FastAPI backend.

4. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

## 🎮 How to Use

### 1. **Configure Azure Services** (Backend)
- Set up Azure OpenAI service with GPT model deployment
- Configure Azure Speech Services (optional for enhanced features)
- Update `.env` file with your Azure credentials

### 2. **Start Both Services**
- **Backend**: Run `uvicorn app:app --reload` in `fastapi-backend/`
- **Frontend**: Run `npm start` in `react-avatar-chat/`

### 3. **Begin AI Coaching Session**
- **Project Setup**: Describe your customer's project requirements
- **Start Avatar**: Click "🚀 Start Session" to initialize the AI coach
- **Interact**: Use voice or text to discuss Azure solutions
- **Get Diagrams**: Ask for architecture diagrams (e.g., "Draw an Azure RAG solution")

### 4. **Conversation Management**
- **Voice Input**: Click "🎤 Start Mic" for voice conversations
- **Text Input**: Use "⌨️ Show Typing" for text-based chat
- **Clear History**: Reset conversation with "🗑️ Clear History"
- **Stop Session**: End session with "⏹️ Stop Session"

## 🔌 API Endpoints

### Main Chat Endpoint
- `POST /chat` - Chat with AI assistant (handles both text and diagram generation)
  - **Request**: `{"prompt": "Design an Azure RAG solution"}`
  - **Text Response**: `{"type": "text", "answer": "Here's how to implement..."}`
  - **Diagram Response**: `{"type": "diagram", "url": "/static/diagrams/...", "summary": {...}}`

### File Download
- `GET /download/{filename}` - Download generated architecture diagrams
- `GET /static/diagrams/{filename}` - Serve diagram images directly

### Health Check
- `GET /` - API health check and service information

## 🛠️ Technical Stack

### Backend
- **FastAPI** modern Python web framework with modular architecture
- **Azure OpenAI SDK** for GPT model integration and function calling
- **Mingrammer Diagrams** for Azure architecture diagram generation
- **Pydantic** for data validation and type safety
- **Professional code organization** with services, schemas, and API layers

### Frontend
- **React 18+** with TypeScript and modern hooks
- **Microsoft Speech SDK** for avatar and voice interaction
- **Styled Components** for responsive UI design
- **WebRTC** for real-time avatar communication
- **Stateless design** with client-side chat history management

### AI & Cloud Services
- **Azure AI Foundry** integration
- **Azure OpenAI Service** with GPT-4/5 models
- **Azure Speech Services** for voice synthesis and recognition
- **Azure Avatar Service** for real-time avatar interactions
- **Function Calling** for intelligent diagram generation

## 🔍 Key Configuration

### Backend Configuration (`config/settings.py`)
```python
# Azure OpenAI Settings
AZURE_OPENAI_DEPLOYMENT = "gpt-5-chat"
AZURE_OPENAI_API_VERSION = "2024-12-01-preview"

# Diagram Generation Settings
MAX_NODES = 60
MAX_EDGES = 120
DIAGRAM_OUTPUT_DIR = "static/diagrams"

# Application Settings
DEBUG = True  # Set to False for production
```

### Frontend Configuration (`hooks/useAvatarService.ts`)
```typescript
const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';

// Avatar configuration
const avatarConfig = {
  ttsVoice: 'en-US-AvaMultilingualNeural',
  talkingAvatarCharacter: 'lisa',
  talkingAvatarStyle: 'casual-sitting',
  continuousConversation: true
}
```

## 🚨 Troubleshooting

### Backend Issues
- **Import errors**: Ensure all dependencies are installed via `pip install -r requirements.txt`
- **Azure connection**: Verify `.env` file has correct Azure AI Foundry credentials
- **Port conflicts**: Change port with `uvicorn main:app --port 8001`
- **Module import**: Use `uvicorn main:app` instead of `app:app` for the refactored structure

### Frontend Issues
- **API connection**: Ensure backend is running on `http://127.0.0.1:8000`
- **Avatar loading**: Check browser console for WebRTC or Speech SDK errors
- **Microphone access**: Grant browser permissions for microphone usage
- **Chat display**: Diagrams now display inline with chat messages

### Common Solutions
1. **Clear browser cache** if experiencing UI issues
2. **Restart both services** for configuration changes
3. **Check firewall settings** for local development ports
4. **Verify Azure quotas** and service availability

## 📊 Key Features & Architecture

### 🎯 Core Functionality
- **Live Avatar Assistant**: Interactive AI coach using Azure Avatar Service for real-time conversations
- **Smart Chat History**: Client-side conversation management with context-aware responses
- **Architecture Diagrams**: Automatic generation of Azure solution diagrams using AI function calling
- **Multi-modal Input**: Support for both voice and text interactions
- **Project Context**: Maintains project details throughout the conversation session

### 🏗️ Technical Architecture
- **Stateless Backend**: FastAPI service focused on AI processing and diagram generation
- **Stateful Frontend**: React application managing chat history and user interactions
- **Modular Design**: Clean separation of concerns with professional code organization
- **Type Safety**: Full TypeScript support with Pydantic validation
- **Real-time Communication**: WebRTC for avatar and voice interactions

## 🔒 Security Considerations

- **API Keys**: Never commit Azure credentials to version control
- **CORS**: Configure appropriate origins for production deployment
- **Session Cleanup**: Automatic session expiration after 24 hours
- **Input Validation**: Pydantic models ensure data integrity
- **Error Handling**: Graceful error responses without exposing internals

## 🚀 Production Deployment

### Backend (FastAPI)
- Deploy to **Azure Container Apps** or **Azure App Service**
- Use **Azure Key Vault** for secrets management
- Configure **Application Insights** for monitoring
- Set up **Azure Redis** for distributed session storage

### Frontend (React)
- Build with `npm run build`
- Deploy to **Azure Static Web Apps** or **Azure Blob Storage**
- Configure **Azure CDN** for global distribution
- Set up **Azure Application Gateway** for SSL termination

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Documentation & Resources

- [Azure AI Foundry Documentation](https://docs.microsoft.com/azure/ai-foundry/)
- [Azure OpenAI Service Documentation](https://docs.microsoft.com/azure/cognitive-services/openai/)
- [Azure Speech Services Documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/)
- [Azure Avatar Service Documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/avatar)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Mingrammer Diagrams](https://diagrams.mingrammer.com/)

## 🤝 Contributing

This is a sample application demonstrating Azure AI services integration for building live avatar assistants. The modular architecture supports easy extension and customization for your specific Azure solution design needs.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

