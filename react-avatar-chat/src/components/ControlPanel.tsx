import React from 'react';
import styled from 'styled-components';
import { SessionState } from '../types/speech';

interface ControlPanelProps {
  sessionState: SessionState;
  onStartSession: () => void;
  onStopSession: () => void;
  onStartMicrophone: () => void;
  onStopMicrophone: () => void;
  onStopSpeaking: () => void;
  onClearHistory: () => void;
  onToggleTypeMessage: () => void;
}

const ControlContainer = styled.div`
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 120, 212, 0.15);
  margin-bottom: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;



const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 120, 212, 0.4);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 120, 212, 0.6);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #107c10 0%, #0e6e0e 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 124, 16, 0.4);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 124, 16, 0.6);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #d13438 0%, #b02a2e 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(209, 52, 56, 0.4);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(209, 52, 56, 0.6);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #605e5c 0%, #484644 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(96, 94, 92, 0.4);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(96, 94, 92, 0.6);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

const StatusIndicator = styled.div<{ isActive: boolean; isConnecting: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 500;
  
  ${props => {
    if (props.isConnecting) {
      return `
        background: rgba(255, 193, 7, 0.1);
        color: #856404;
        border: 1px solid rgba(255, 193, 7, 0.3);
      `;
    }
    if (props.isActive) {
      return `
        background: rgba(40, 167, 69, 0.1);
        color: #155724;
        border: 1px solid rgba(40, 167, 69, 0.3);
      `;
    }
    return `
      background: rgba(108, 117, 125, 0.1);
      color: #495057;
      border: 1px solid rgba(108, 117, 125, 0.3);
    `;
  }}

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    
    ${props => {
      if (props.isConnecting) {
        return `
          background: #ffc107;
          animation: pulse 2s infinite;
        `;
      }
      if (props.isActive) {
        return `
          background: #28a745;
          animation: pulse 2s infinite;
        `;
      }
      return `background: #6c757d;`;
    }}
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;



export const ControlPanel: React.FC<ControlPanelProps> = ({
  sessionState,
  onStartSession,
  onStopSession,
  onStartMicrophone,
  onStopMicrophone,
  onStopSpeaking,
  onClearHistory,
  onToggleTypeMessage
}) => {
  const getStatusText = () => {
    if (sessionState.isConnecting) return 'Connecting to Azure AI Coach...';
    if (sessionState.isActive) return 'Ready for Azure Solution Design';
    return 'Azure Coach Session Inactive';
  };

  return (
    <ControlContainer>
      <Title>☁️ Azure Cloud Solution AI Coach</Title>
      
      <StatusIndicator 
        isActive={sessionState.isActive} 
        isConnecting={sessionState.isConnecting}
      >
        {getStatusText()}
      </StatusIndicator>

      <ButtonGrid>
        <Button 
          variant="primary"
          onClick={onStartSession} 
          disabled={sessionState.isActive || sessionState.isConnecting}
        >
          {sessionState.isConnecting ? '🔄 Connecting...' : '🚀 Start Coaching'}
        </Button>

        <Button 
          variant="danger"
          onClick={onStopSession} 
          disabled={!sessionState.isActive && !sessionState.isConnecting}
        >
          ⏹️ Stop Coaching
        </Button>

        <Button 
          variant="success"
          onClick={sessionState.isMicrophoneActive ? onStopMicrophone : onStartMicrophone}
          disabled={!sessionState.isActive}
        >
          {sessionState.isMicrophoneActive ? '⏸️ Stop Mic' : '🎤 Start Mic'}
        </Button>

        <Button 
          variant="secondary"
          onClick={onStopSpeaking} 
          disabled={!sessionState.isSpeaking}
        >
          🔇 Stop Speaking
        </Button>

        <Button 
          variant="secondary"
          onClick={onToggleTypeMessage} 
          disabled={!sessionState.isActive}
        >
          {sessionState.showTypeMessage ? '⌨️ Hide Typing' : '⌨️ Show Typing'}
        </Button>

        <Button 
          variant="secondary"
          onClick={onClearHistory}
        >
          🗑️ Clear History
        </Button>
      </ButtonGrid>
    </ControlContainer>
  );
};
