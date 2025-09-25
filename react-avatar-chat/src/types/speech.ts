export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | MessageContent[];
}

export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface AvatarConfig {
  region: string;
  apiKey: string;
  azureOpenAIEndpoint: string;
  azureOpenAIApiKey: string;
  azureOpenAIDeploymentName: string;
  sttLocales: string;
  ttsVoice: string;
  continuousConversation: boolean;
  talkingAvatarCharacter: string;
  talkingAvatarStyle: string;
  systemPrompt: string;
}

export interface SessionState {
  isActive: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isMicrophoneActive: boolean;
  showTypeMessage: boolean;
}

export interface WebRTCEvent {
  event: {
    eventType: string;
  };
}

declare global {
  namespace SpeechSDK {
    class SpeechConfig {
      static fromSubscription(subscriptionKey: string, region: string): SpeechConfig;
      static fromEndpoint(endpoint: URL, subscriptionKey: string): SpeechConfig;
      endpointId: string;
      setProperty(propertyId: PropertyId, value: string): void;
    }

    class AvatarConfig {
      constructor(character: string, style: string);
      customized: boolean;
      useBuiltInVoice: boolean;
    }

    class AvatarSynthesizer {
      constructor(speechConfig: SpeechConfig, avatarConfig: AvatarConfig);
      avatarEventReceived: ((sender: any, event: any) => void) | null;
      startAvatarAsync(peerConnection: RTCPeerConnection): Promise<any>;
      speakSsmlAsync(ssml: string): Promise<any>;
      stopSpeakingAsync(): Promise<any>;
      close(): void;
    }

    class SpeechRecognizer {
      static FromConfig(
        speechConfig: SpeechConfig,
        autoDetectConfig: AutoDetectSourceLanguageConfig,
        audioConfig: AudioConfig
      ): SpeechRecognizer;
      recognized: ((sender: any, event: any) => void) | null;
      startContinuousRecognitionAsync(callback: () => void, errorCallback: (error: any) => void): void;
      stopContinuousRecognitionAsync(callback: () => void, errorCallback: (error: any) => void): void;
      close(): void;
    }

    class AutoDetectSourceLanguageConfig {
      static fromLanguages(languages: string[]): AutoDetectSourceLanguageConfig;
    }

    class AudioConfig {
      static fromDefaultMicrophoneInput(): AudioConfig;
    }

    enum PropertyId {
      SpeechServiceConnection_LanguageIdMode = 'SpeechServiceConnection_LanguageIdMode'
    }

    enum ResultReason {
      SynthesizingAudioCompleted = 'SynthesizingAudioCompleted',
      RecognizedSpeech = 'RecognizedSpeech',
      Canceled = 'Canceled'
    }

    enum CancellationReason {
      Error = 'Error'
    }

    class CancellationDetails {
      static fromResult(result: any): CancellationDetails;
      reason: CancellationReason;
      errorDetails: string;
    }
  }
}

export {};
