import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ControlPanel } from './components/ControlPanel';
import { VideoContainer } from './components/VideoContainer';
import { ProjectInputPanel } from './components/ProjectInputPanel';
import { useAvatarService } from './hooks/useAvatarService';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f9ff 0%, #deecff 100%);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  color: #323130;
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ErrorBanner = styled.div`
  background: linear-gradient(135deg, #d13438 0%, #b02a2e 100%);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(209, 52, 56, 0.3);
`;

function App() {
  const {
    sessionState,
    messages,
    chatHistory,
    projectDetails,
    connectAvatar,
    disconnectAvatar,
    startMicrophone,
    stopMicrophone,
    stopSpeaking,
    handleUserQuery,
    clearChatHistory,
    toggleTypeMessage,
    handleProjectDetailsChange,
    handleProjectDetailsBlur
  } = useAvatarService();

  const [speechSDKLoaded, setSpeechSDKLoaded] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  useEffect(() => {
    // Load Speech SDK
    const script = document.createElement('script');
    script.src = 'https://aka.ms/csspeech/jsbrowserpackageraw';
    script.onload = () => {
      console.log('Speech SDK loaded successfully');
      setSpeechSDKLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Speech SDK');
      setLoadError('Failed to load Microsoft Speech SDK. Please check your internet connection and try again.');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const handleStartSession = () => {
    if (speechSDKLoaded) {
      connectAvatar();
    } else {
      setLoadError('Speech SDK is not loaded yet. Please wait and try again.');
    }
  };

  if (loadError) {
    return (
      <AppContainer>
        <Container>
          <ErrorBanner>
            <h3>🚫 Error</h3>
            <p>{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                marginTop: '1rem',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Page
            </button>
          </ErrorBanner>
        </Container>
      </AppContainer>
    );
  }

  if (!speechSDKLoaded) {
    return (
      <AppContainer>
        <Container>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'spin 2s linear infinite'
            }}>⏳</div>
            <h2>Loading Azure AI Coach...</h2>
            <p>Please wait while we load the Microsoft Speech SDK</p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </Container>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Container>
        <ProjectInputPanel
          onProjectDetailsChange={handleProjectDetailsChange}
          onProjectDetailsBlur={handleProjectDetailsBlur}
          projectDetails={projectDetails}
        />

        <ControlPanel
          sessionState={sessionState}
          onStartSession={handleStartSession}
          onStopSession={disconnectAvatar}
          onStartMicrophone={startMicrophone}
          onStopMicrophone={stopMicrophone}
          onStopSpeaking={stopSpeaking}
          onClearHistory={clearChatHistory}
          onToggleTypeMessage={toggleTypeMessage}
        />

        <VideoContainer
          sessionState={sessionState}
          chatHistory={chatHistory}
          messages={messages}
          onUserMessage={handleUserQuery}
        />
      </Container>
    </AppContainer>
  );
}

export default App;
