import React from 'react';
import styled from 'styled-components';
import { SessionState, ChatMessage } from '../types/speech';

interface VideoContainerProps {
  sessionState: SessionState;
  chatHistory: string;
  messages: ChatMessage[];
  onUserMessage: (message: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const VideoSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 120, 212, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
    background-size: 50px 50px;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #1a1a2e;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  aspect-ratio: 16 / 9;

  #remoteVideo {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 15px;
    }
  }

  @media (max-width: 768px) {
    aspect-ratio: 4 / 3;
  }
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 2rem;

  .avatar-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.8;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    .avatar-icon {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const ChatSection = styled.div`
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 500px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 400px;
  }
`;

const ChatTitle = styled.h3`
  color: #323130;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '☁️';
    margin-right: 10px;
    font-size: 1.2em;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

const ChatHistory = styled.div`
  flex: 1;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  max-height: 400px;
  min-height: 300px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #2c3e50;
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
`;

const MessageContainer = styled.div`
  margin: 1rem 0;
`;

const UserMessage = styled.div`
  background: #e3f2fd;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-left: 4px solid #2196f3;
  
  &:before {
    content: "👤 User: ";
    font-weight: bold;
    color: #1976d2;
  }
`;

const AssistantMessage = styled.div`
  background: #f8f9fa;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-left: 4px solid #28a745;
  
  &:before {
    content: "🤖 AI Coach: ";
    font-weight: bold;
    color: #28a745;
  }
`;

const DiagramImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 1rem 0;
  display: block;
`;

const DiagramContainer = styled.div`
  text-align: center;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #0078d4;
  margin: 0.5rem 0;
`;const MessageInput = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'flex' : 'none'};
  gap: 1rem;
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 80px;
  max-height: 200px;
  padding: 1rem;
  border: 2px solid #edebe9;
  border-radius: 15px;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  background: #faf9f8;

  &:focus {
    outline: none;
    border-color: #0078d4;
    box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
    background: white;
  }

  &::placeholder {
    color: #a19f9d;
  }

  @media (max-width: 768px) {
    min-height: 60px;
    font-size: 0.9rem;
  }
`;

const SendButton = styled.button`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 120, 212, 0.4);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 120, 212, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(0, 120, 212, 0.1);
  border-radius: 10px;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #605e5c;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

const StatusIndicator = styled.span<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.active ? '#107c10' : '#8a8886'};
    ${props => props.active && 'animation: pulse 2s infinite;'}
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

export const VideoContainer: React.FC<VideoContainerProps> = ({
  sessionState,
  chatHistory,
  messages,
  onUserMessage
}) => {
  const [userInput, setUserInput] = React.useState('');

  const handleSendMessage = () => {
    if (userInput.trim() && sessionState.isActive) {
      onUserMessage(userInput.trim());
      setUserInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render message content (text or image)
  const renderMessageContent = (content: string | any[]) => {
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle array content (for images)
    if (Array.isArray(content)) {
      return content.map((item, index) => {
        if (item.type === 'text') {
          return <div key={index}>{item.text}</div>;
        } else if (item.type === 'image_url' && item.image_url?.url) {
          return (
            <DiagramContainer key={index}>
              <DiagramImage 
                src={item.image_url.url} 
                alt="Azure Architecture Diagram" 
                onError={(e) => {
                  console.error('Failed to load diagram:', item.image_url.url);
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </DiagramContainer>
          );
        }
        return null;
      });
    }
    
    return content;
  };

  return (
    <Container>
      <VideoSection>
        <VideoWrapper>
          <div id="remoteVideo">
            {!sessionState.isActive && !sessionState.isConnecting && (
              <PlaceholderContent>
                <div className="avatar-icon">👩‍💼</div>
                <h3>Your Azure Cloud Solution AI Coach</h3>
                <p>Start a coaching session to get Azure architecture recommendations from Lisa</p>
              </PlaceholderContent>
            )}
            {sessionState.isConnecting && (
              <PlaceholderContent>
                <div className="avatar-icon">⏳</div>
                <h3>Connecting to Azure AI Coach...</h3>
                <p>Establishing connection with your cloud solution expert</p>
              </PlaceholderContent>
            )}
          </div>
        </VideoWrapper>
      </VideoSection>

      <ChatSection>
        <ChatTitle>Azure Solution Design Session</ChatTitle>
        
        <ChatHistory>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageContainer key={index}>
                {message.role === 'user' ? (
                  <UserMessage>
                    {renderMessageContent(message.content)}
                  </UserMessage>
                ) : message.role === 'assistant' ? (
                  <AssistantMessage>
                    {renderMessageContent(message.content)}
                  </AssistantMessage>
                ) : null}
              </MessageContainer>
            ))
          ) : (
            <div>Start your Azure solution design session by speaking or typing about your customer requirements. Your AI coach will provide tailored Azure architecture recommendations!</div>
          )}
        </ChatHistory>

        <MessageInput show={sessionState.showTypeMessage}>
          <TextArea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your Azure solution question here... (Press Enter to send)"
            disabled={!sessionState.isActive}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!sessionState.isActive || !userInput.trim()}
          >
            📤 Send
          </SendButton>
        </MessageInput>

        <StatusBar>
          <StatusIndicator active={sessionState.isActive}>
            Coaching Session: {sessionState.isActive ? 'Active' : 'Inactive'}
          </StatusIndicator>
          
          <StatusIndicator active={sessionState.isMicrophoneActive}>
            Microphone: {sessionState.isMicrophoneActive ? 'Listening' : 'Off'}
          </StatusIndicator>
          
          <StatusIndicator active={sessionState.isSpeaking}>
            AI Coach: {sessionState.isSpeaking ? 'Speaking' : 'Idle'}
          </StatusIndicator>
        </StatusBar>
      </ChatSection>
    </Container>
  );
};
