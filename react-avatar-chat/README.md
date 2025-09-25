# 🤖 Modern AI Avatar Chat

A modern, professional React.js application that provides an interactive chat interface with an AI-powered avatar using Microsoft Azure Speech Services and Azure OpenAI.


## 🎥 Application Demo

[![Watch the Demo](https://img.youtube.com/vi/zUnORlh5Vkw/hqdefault.jpg)](https://www.youtube.com/watch?v=zUnORlh5Vkw)



## ✨ Features

- **🎭 AI Avatar Integration**: Interactive conversation with Lisa avatar in casual-sitting pose
- **🎤 Multi-language Speech Recognition**: Support for 8 languages (English, German, Spanish, French, Italian, Japanese, Korean, Chinese)
- **🧠 Azure OpenAI Integration**: Powered by GPT-5-chat model
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI/UX**: Professional gradient design with smooth animations
- **🔄 Real-time Conversation**: Continuous conversation mode with streaming responses
- **⌨️ Flexible Input**: Both voice and text input options
- **🎯 Fixed Configuration**: Pre-configured with optimal settings for immediate use

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Modern web browser with WebRTC support

### Installation & Running

1. **Navigate to the project directory:**
   ```bash
   cd react-avatar-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to `http://localhost:3000`

## 🎮 How to Use

1. **Configure System Prompt** (Optional):
   - The only user-configurable setting
   - Default: "You are an AI assistant that helps people find information."
   - Customize to change the AI's behavior and personality

2. **Start Avatar Session**:
   - Click "🚀 Start Session" to initialize the avatar connection
   - Wait for the connection to establish (usually 5-10 seconds)

3. **Begin Conversation**:
   - **Voice Input**: Click "🎤 Start Mic" and speak naturally
   - **Text Input**: Click "⌨️ Show Typing" to reveal the text input area

4. **Manage Conversation**:
   - Use "🔇 Stop Speaking" to interrupt the avatar
   - Use "🗑️ Clear History" to start fresh
   - Use "⏹️ Stop Session" to end the session

## 🔧 Pre-configured Settings

The following settings are fixed for optimal performance:

### 🗣️ Azure Speech Service
- **Region**: East US 2
- **Voice**: en-US-AvaMultilingualNeural
- **Languages**: en-US, de-DE, es-ES, fr-FR, it-IT, ja-JP, ko-KR, zh-CN

### 🤖 Azure OpenAI
- **Model**: GPT-5-chat
- **Endpoint**: ai-foundry-tts-avatar.cognitiveservices.azure.com
- **Stream**: Enabled for real-time responses

### 🎭 Avatar Configuration
- **Character**: Lisa
- **Style**: casual-sitting
- **Continuous Conversation**: Enabled


## 🛠️ Technical Stack

- **Frontend**: React 19+ with TypeScript
- **Styling**: Styled-components with CSS-in-JS
- **Speech SDK**: Microsoft Cognitive Services Speech SDK
- **WebRTC**: Real-time communication for avatar video/audio
- **Build Tool**: Create React App with TypeScript template

## 🔍 Troubleshooting

### Common Issues

1. **"Speech SDK not loaded" error**:
   - Ensure stable internet connection
   - Refresh the page and try again
   - Check browser console for network errors

2. **Avatar connection fails**:
   - Verify microphone permissions are granted
   - Check if WebRTC is supported in your browser
   - Ensure firewall allows WebRTC connections

3. **No audio/video**:
   - Check browser permissions for camera/microphone
   - Ensure speakers/headphones are connected
   - Try refreshing the page

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+


## 📄 License

This project is licensed under the MIT License - see the original project for details.

## 🤝 Contributing

This is a sample application demonstrating Azure Speech and OpenAI integration. For production use, consider:

- Adding proper error handling and retry logic
- Implementing authentication and authorization
- Adding logging and monitoring
- Optimizing for your specific use case


For questions about Azure services:
- [Azure Speech Services Documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/)
- [Azure OpenAI Documentation](https://docs.microsoft.com/azure/cognitive-services/openai/)

---

**Built using React, TypeScript, and Azure AI Services**
