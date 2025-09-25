# Azure Cloud Solution AI Coach

An intelligent coaching application designed specifically for Customer Success Architects (CSAs) to design and recommend optimal Azure solutions for their customers.

## Overview

The Azure Cloud Solution AI Coach leverages cutting-edge AI technologies to help CSAs:

- **Analyze customer requirements** and project scenarios
- **Design tailored Azure architectures** based on specific needs
- **Get real-time recommendations** for Azure services and configurations
- **Receive best practice guidance** for implementation and deployment
- **Interactive voice conversations** with an AI coach avatar powered by Azure Speech Service

## Key Features

### 🎯 **AI-Powered Solution Design**
- Upload customer project scenarios and requirements
- Get personalized Azure architecture recommendations
- Interactive Q&A with an AI coach specialized in Azure solutions

### 🗣️ **Voice-Enabled Coaching**
- Natural speech interaction using Azure Speech Service
- Real-time voice recognition and response
- Professional AI avatar for engaging conversations

### ☁️ **Azure-Focused Expertise**
- Deep knowledge of Azure services and best practices
- Cost optimization recommendations
- Security and compliance guidance
- Migration and modernization strategies

### 💼 **Professional CSA Interface**
- Clean, Azure-branded user interface
- Optimized for customer-facing scenarios
- Professional presentation suitable for client meetings

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Styled Components with Azure design system
- **AI Services**: 
  - Azure OpenAI (GPT-5) for intelligent recommendations
  - Azure Speech Service for voice interaction
  - Azure Avatar Service for realistic AI coach presentation
- **PDF Processing**: PDF.js for document analysis

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm or yarn package manager
- Azure Speech Service subscription
- Azure OpenAI service access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd azure-csa-ai-coach
```

2. Install dependencies:
```bash
npm install
```

3. Configure Azure services:
   - Update the Azure keys and endpoints in `src/hooks/useAvatarService.ts`
   - Ensure your Azure Speech Service and OpenAI services are properly configured

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Usage

### For Customer Success Architects (CSAs)

1. **Start a Coaching Session**: Click "Start Coaching" to connect with your AI coach
2. **Upload Project Information**: 
   - Upload customer project scenarios (PDF/TXT files)
   - Enter specific customer requirements and constraints
3. **Interactive Consultation**: 
   - Ask questions about Azure architecture options
   - Get recommendations for specific use cases
   - Discuss implementation strategies and best practices
4. **Voice or Text Interaction**: Choose between speaking naturally or typing your questions

### Sample Use Cases

- **Cloud Migration Planning**: Get guidance on migrating on-premises workloads to Azure
- **Architecture Design**: Design scalable, secure Azure solutions for specific requirements
- **Cost Optimization**: Receive recommendations for cost-effective Azure service combinations
- **Compliance Requirements**: Understand Azure services for regulatory compliance needs
- **Performance Optimization**: Get advice on optimizing Azure deployments for performance

## Configuration

### Azure Service Configuration

The application requires the following Azure services:

1. **Azure Speech Service**
   - Text-to-Speech for avatar voice
   - Speech-to-Text for voice recognition
   - Region: East US 2 (configured)

2. **Azure OpenAI Service**
   - GPT model for intelligent coaching responses
   - Deployment name: gpt-5-chat (configured)

3. **Azure Avatar Service**
   - Realistic AI coach presentation
   - Character: Lisa (configured)
   - Style: Casual sitting (configured)

### Customization

- **System Prompts**: Modify coaching behavior in `useAvatarService.ts`
- **UI Branding**: Update colors and styling in styled-components
- **Avatar Character**: Change avatar character and style in the configuration

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Azure Speech    │    │  Azure OpenAI   │
│                 │────│     Service      │    │    Service      │
│ • ProjectInput  │    │                  │    │                 │
│ • ControlPanel  │    │ • Voice Recognition │ │ • GPT-5 Chat    │
│ • VideoContainer│    │ • Text-to-Speech │    │ • AI Coaching   │
│ • Avatar UI     │────│ • Avatar Service │    │ • Recommendations│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

### Project Structure

```
src/
├── components/           # React components
│   ├── ControlPanel.tsx     # Session controls and status
│   ├── ProjectInputPanel.tsx # Customer requirements input
│   └── VideoContainer.tsx   # Chat and avatar display
├── hooks/               # Custom React hooks
│   └── useAvatarService.ts  # Main service integration
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## Best Practices

### For CSAs using this tool:

1. **Prepare Customer Context**: Upload comprehensive project documentation for better recommendations
2. **Be Specific**: Provide detailed requirements including technical, business, and compliance needs
3. **Interactive Approach**: Use the voice feature for natural conversation flow
4. **Document Insights**: Save key recommendations and architectural decisions
5. **Client Presentations**: Use the professional interface during customer meetings

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Security Considerations

- **API Keys**: Ensure Azure service keys are properly secured
- **Customer Data**: Handle customer information according to Microsoft privacy standards
- **HTTPS**: Use secure connections for all Azure service communications
- **Authentication**: Implement proper authentication for production deployments

## Support

For support and questions:
- Review Azure documentation for service-specific guidance
- Check the troubleshooting section below
- Contact your Azure support team for service-related issues

## Troubleshooting

### Common Issues

1. **Speech Service Connection**: Verify API keys and region settings
2. **Avatar Loading**: Ensure browser supports WebRTC and has camera/microphone permissions
3. **OpenAI Responses**: Check API quota and model deployment status
4. **PDF Upload**: Verify PDF.js worker file is accessible

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited avatar features
- Mobile browsers: Text interaction only

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Microsoft Azure team for excellent AI services
- React community for robust frontend framework
- Open source contributors for supporting libraries