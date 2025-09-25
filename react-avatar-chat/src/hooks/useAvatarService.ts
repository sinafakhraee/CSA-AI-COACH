import { useState, useCallback, useRef, useEffect } from 'react';
import { AvatarConfig, ChatMessage, SessionState } from '../types/speech';

// Fixed configuration - matches original chat.html
const FIXED_CONFIG: AvatarConfig = {
  region: 'Azure Speech Service Region',
  apiKey: 'Azure Speech Service API KEY',
  azureOpenAIEndpoint: '',
  azureOpenAIApiKey: '',
  azureOpenAIDeploymentName: 'gpt-5-chat',
  sttLocales: 'en-US,de-DE,es-ES,fr-FR,it-IT,ja-JP,ko-KR,zh-CN',
  ttsVoice: 'en-US-AvaMultilingualNeural',
  continuousConversation: true,
  talkingAvatarCharacter: 'lisa',
  talkingAvatarStyle: 'casual-sitting',
  systemPrompt: 'Hello! I am your Azure Cloud Solution AI Coach, here to help you design and recommend the best Azure solutions for your customers. Please describe your customer project requirements or scenario, and I will provide tailored Azure architecture recommendations, best practices, and solution guidance. I can help you navigate Azure services, suggest optimal configurations, discuss pricing considerations, and provide implementation strategies. Let us get started - what customer challenge are you working on today? CRITICAL COACHING GUIDELINES: Focus on one solution aspect at a time to provide clear, actionable guidance. Ask clarifying questions to better understand customer requirements. Provide specific Azure service recommendations with rationale. Remember and build upon previous context in our conversation. When user asks to repeat information, provide the same detailed explanation. Wait for complete project description before diving into solutions. Maintain context throughout the entire conversation. IMPORTANT: Use natural, conversational language that flows well when spoken aloud. Avoid complex punctuation, brackets, or special characters. Spell out abbreviations and acronyms clearly. Use "and" instead of "&" symbols. Keep sentences moderate length for natural speech pauses. Avoid markdown formatting or bullet points in responses.'
};

// Global variables to match original implementation
// Note: These are kept for potential future TTS enhancements
// const sentenceLevelPunctuations = ['.', '?', '!', ':', ';', '。', '？', '！', '：', '；'];
// const phraseBreakPunctuations = [',', '–', '—', '(', ')', '"'];

export const useAvatarService = (): {
  sessionState: SessionState;
  messages: ChatMessage[];
  chatHistory: string;
  projectDetails: string;
  connectAvatar: () => Promise<void>;
  disconnectAvatar: () => void;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  stopSpeaking: () => Promise<void>;
  handleUserQuery: (query: string) => Promise<void>;
  speak: (text: string) => void;
  clearChatHistory: () => void;
  toggleTypeMessage: () => void;
  handleProjectDetailsChange: (text: string) => void;
  handleProjectDetailsBlur: (text: string) => void;
  updateSystemPrompt: () => void;
} => {
  // State matching original globals
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    isConnecting: false,
    isSpeaking: false,
    isMicrophoneActive: false,
    showTypeMessage: false
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<string>('');
  const [projectDetails, setProjectDetails] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);

  // FastAPI base URL - should match your backend
  const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';

  // Refs for SDK objects (matching original globals)
  const avatarSynthesizerRef = useRef<any>(null);
  const speechRecognizerRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const spokenTextQueueRef = useRef<string[]>([]);
  const currentSpeakingTextRef = useRef<string>('');
  const lastInteractionTimeRef = useRef<Date>(new Date());
  const isSpeakingRef = useRef<boolean>(false); // Track speaking state immediately like original
  const handleUserQueryRef = useRef<((query: string) => Promise<void>) | null>(null);

  // Initialize messages with dynamic system prompt
  const initMessages = useCallback(() => {
    let systemPrompt = FIXED_CONFIG.systemPrompt;
    
    // Enhance system prompt if customer project details are provided
    if (projectDetails) {
      systemPrompt = `You are an Azure Cloud Solution AI Coach named Lisa. Help Customer Success Architects (CSAs) design optimal Azure solutions for their customers based on comprehensive project information.

CUSTOMER PROJECT DETAILS:
${projectDetails}

Your role as Azure Cloud Solution AI Coach:
- Analyze customer project details and recommend appropriate Azure services
- Design cloud architecture solutions tailored to specific needs
- Provide Azure best practices and implementation guidance
- Suggest cost-effective Azure service combinations
- Help identify potential challenges and mitigation strategies
- Recommend Azure governance, security, and compliance approaches
- Guide on Azure migration strategies and modernization paths

CRITICAL COACHING GUIDELINES:
- Focus on one solution aspect at a time to provide clear, actionable guidance
- Ask clarifying questions to better understand customer requirements
- Provide specific Azure service recommendations with clear rationale
- Remember and build upon previous context in the conversation
- When user asks to repeat information, provide the same detailed explanation
- Wait for complete requirements before diving into detailed solutions
- Maintain context throughout the entire conversation

Be encouraging, professional, and provide constructive Azure solution guidance. Keep responses conversational and focused since this is a spoken interaction.

IMPORTANT TTS GUIDELINES:
- Use natural, conversational language that flows well when spoken aloud
- Avoid complex punctuation, brackets, or special characters
- Spell out abbreviations and acronyms (e.g., "Azure" as "Azure", "VM" as "Virtual Machine")
- Use "and" instead of "&" symbols
- Keep sentences moderate length for natural speech pauses
- Avoid markdown formatting or bullet points in responses`;
    }
    
    const systemMessage: ChatMessage = {
      role: 'system',
      content: systemPrompt
    };
    
    // Preserve existing conversation history, just update the system message
    setMessages(prevMessages => {
      const conversationMessages = prevMessages.filter(m => m.role !== 'system');
      return [systemMessage, ...conversationMessages];
    });
  }, [projectDetails]);

  // Update system prompt without resetting conversation
  const updateSystemPrompt = useCallback(() => {
    let systemPrompt = FIXED_CONFIG.systemPrompt;
    
    // Enhance system prompt if customer project details are provided
    if (projectDetails) {
      systemPrompt = `You are an Azure Cloud Solution AI Coach named Lisa. Help Customer Success Architects (CSAs) design optimal Azure solutions for their customers based on comprehensive project information.

CUSTOMER PROJECT DETAILS:
${projectDetails}

Your role as Azure Cloud Solution AI Coach:
- Analyze customer project details and recommend appropriate Azure services
- Design cloud architecture solutions tailored to specific needs
- Provide Azure best practices and implementation guidance
- Suggest cost-effective Azure service combinations
- Help identify potential challenges and mitigation strategies
- Recommend Azure governance, security, and compliance approaches
- Guide on Azure migration strategies and modernization paths

CRITICAL COACHING GUIDELINES:
- Focus on one solution aspect at a time to provide clear, actionable guidance
- Ask clarifying questions to better understand customer requirements
- Provide specific Azure service recommendations with clear rationale
- Remember and build upon previous context in the conversation
- When user asks to repeat information, provide the same detailed explanation
- Wait for complete requirements before diving into detailed solutions
- Maintain context throughout the entire conversation

Be encouraging, professional, and provide constructive Azure solution guidance. Keep responses conversational and focused since this is a spoken interaction.

IMPORTANT TTS GUIDELINES:
- Use natural, conversational language that flows well when spoken aloud
- Avoid complex punctuation, brackets, or special characters
- Spell out abbreviations and acronyms (e.g., "Azure" as "Azure", "VM" as "Virtual Machine")
- Use "and" instead of "&" symbols
- Keep sentences moderate length for natural speech pauses
- Avoid markdown formatting or bullet points in responses`;
    }

    // Update system message in conversation
    setMessages(prevMessages => {
      const conversationMessages = prevMessages.filter(m => m.role !== 'system');
      return [{ role: 'system', content: systemPrompt }, ...conversationMessages];
    });
  }, [projectDetails]);

  // Update system prompt when project details change
  useEffect(() => {
    if (projectDetails) {
      console.log('DEBUG: Project details changed, updating system prompt...');
      updateSystemPrompt();
    }
  }, [projectDetails, updateSystemPrompt]);

  // Session management - FastAPI handles sessions internally
  // No need for explicit session creation

  // Helper function to build conversation context from text messages only
  const buildConversationContext = useCallback(() => {
    if (messages.length === 0) return '';
    
    // Filter only text messages and build conversation history
    const textMessages = messages
      .filter(msg => typeof msg.content === 'string') // Only text content
      .slice(-10) // Keep last 10 messages to avoid token limits
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    return textMessages;
  }, [messages]);

  // New FastAPI integration function with context
  const callFastAPIChat = useCallback(async (prompt: string): Promise<any> => {
    try {
      // Build the full prompt with project context and conversation history
      let fullPrompt = prompt;
      
      // Add project context if available
      if (projectDetails.trim()) {
        fullPrompt = `Project Context: ${projectDetails}\n\n${fullPrompt}`;
      }
      
      // Add conversation history for context
      const conversationHistory = buildConversationContext();
      if (conversationHistory.trim()) {
        fullPrompt = `Conversation History:\n${conversationHistory}\n\nCurrent Question: ${fullPrompt}`;
      }

      console.log('DEBUG: Sending full prompt with context:', fullPrompt);

      const response = await fetch(`${FASTAPI_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: fullPrompt
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FastAPI chat failed: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }

      // Parse JSON response
      const data = await response.json();
      console.log('FastAPI response:', data);
      return data;
    } catch (error) {
      console.error('Error calling FastAPI chat:', error);
      throw error;
    }
  }, [projectDetails, buildConversationContext]);

  // Function to create diagram message in chat
  const addDiagramToChat = useCallback((imageUrl: string, summary?: any) => {
    try {
      // Create assistant message with diagram
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      };

      // Add summary as text if available
      if (summary?.title) {
        const summaryMessage: ChatMessage = {
          role: 'assistant',
          content: `📊 **${summary.title}**\n\n*Diagram generated with ${summary.nodes || 0} services and ${summary.edges || 0} connections*`
        };
        setMessages(prev => [...prev, summaryMessage, assistantMessage]);
      } else {
        setMessages(prev => [...prev, assistantMessage]);
      }

      console.log('DEBUG: Diagram added to chat successfully');
      
    } catch (error) {
      console.error('Error adding diagram to chat:', error);
    }
  }, []);

  // HTML encoding function (matches original)
  const htmlEncode = (text: string): string => {
    const entityMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return String(text).replace(/[&<>"'\/]/g, (match) => entityMap[match]);
  };

  // TTS-friendly text processing function (kept for future use)
  // const makeTTSFriendly = (text: string): string => {
  //   return text
  //     // Replace common symbols with spoken equivalents
  //     .replace(/&/g, ' and ')
  //     .replace(/@/g, ' at ')
  //     .replace(/%/g, ' percent ')
  //     .replace(/\$/g, ' dollars ')
  //     .replace(/\+/g, ' plus ')
  //     .replace(/=/g, ' equals ')
  //     .replace(/#/g, ' number ')
  //     
  //     // Remove or replace problematic punctuation
  //     .replace(/[\[\]{}]/g, '') // Remove brackets
  //     .replace(/\*/g, '') // Remove asterisks (markdown)
  //     .replace(/`/g, '') // Remove backticks (markdown)
  //     .replace(/~/g, '') // Remove tildes
  //     .replace(/\|/g, ' or ') // Replace pipes with "or"
  //     
  //     // Fix common abbreviations
  //     .replace(/\bHTTP\b/g, 'H-T-T-P')
  //     .replace(/\bHTML\b/g, 'H-T-M-L')
  //     .replace(/\bCSS\b/g, 'C-S-S')
  //     .replace(/\bJS\b/g, 'JavaScript')
  //     .replace(/\bAPI\b/g, 'A-P-I')
  //     .replace(/\bSQL\b/g, 'S-Q-L')
  //     .replace(/\bUI\b/g, 'U-I')
  //     .replace(/\bUX\b/g, 'U-X')
  //     .replace(/\bCEO\b/g, 'C-E-O')
  //     .replace(/\bCTO\b/g, 'C-T-O')
  //     .replace(/\bHR\b/g, 'H-R')
  //     .replace(/\bIT\b/g, 'I-T')
  //     
  //     // Clean up multiple spaces and normalize whitespace
  //     .replace(/\s+/g, ' ')
  //     .trim();
  // };

  // Speak function matching original implementation
  const speak = useCallback((text: string, endingSilenceMs: number = 0) => {
    if (isSpeakingRef.current) {
      spokenTextQueueRef.current.push(text);
      return;
    }
    speakNext(text, endingSilenceMs);
  }, []); // Dependencies will be handled in speakNext

  // speakNext function (temporarily disable TTS processing for debugging)
  const speakNext = useCallback(async (text: string, endingSilenceMs: number = 0) => {
    if (!avatarSynthesizerRef.current) return;

    // Use original text without TTS processing for now
    const ttsText = text;

    console.log(`DEBUG: About to speak: "${ttsText.substring(0, 100)}..."`);
    console.log(`DEBUG: Avatar synthesizer ready:`, !!avatarSynthesizerRef.current);

    const ssml = endingSilenceMs > 0
      ? `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${FIXED_CONFIG.ttsVoice}'><mstts:leadingsilence-exact value='0'/>${htmlEncode(ttsText)}<break time='${endingSilenceMs}ms' /></voice></speak>`
      : `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${FIXED_CONFIG.ttsVoice}'><mstts:leadingsilence-exact value='0'/>${htmlEncode(ttsText)}</voice></speak>`;

    // Update chat history when speaking (matches original enableDisplayTextAlignmentWithSpeech behavior)
    // Use original text for display, but TTS-processed text for speech
    setChatHistory(prev => prev + text.replace(/\n/g, '<br/>'));

    lastInteractionTimeRef.current = new Date();
    isSpeakingRef.current = true; // Set ref immediately like original
    setSessionState(prev => ({ ...prev, isSpeaking: true }));
    currentSpeakingTextRef.current = text;

    try {
      const result = await avatarSynthesizerRef.current.speakSsmlAsync(ssml);
      
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log(`SUCCESS: Speech synthesized: ${ttsText}. Original: ${text}. Result ID: ${result.resultId}`);
        lastInteractionTimeRef.current = new Date();
      } else {
        console.error(`ERROR: Speech synthesis failed. Reason: ${result.reason}. Result ID: ${result.resultId}. Error details:`, result.errorDetails);
      }
    } catch (error) {
      console.error(`EXCEPTION: Error occurred while speaking the SSML:`, error);
    } finally {
      currentSpeakingTextRef.current = '';

      if (spokenTextQueueRef.current.length > 0) {
        speakNext(spokenTextQueueRef.current.shift()!);
      } else {
        isSpeakingRef.current = false; // Clear ref immediately like original
        setSessionState(prev => ({ ...prev, isSpeaking: false }));
      }
    }
  }, []); // No dependencies needed - uses refs and global config

  // stopSpeaking function (matches original exactly)
  const stopSpeaking = useCallback(async () => {
    if (!avatarSynthesizerRef.current) return;

    lastInteractionTimeRef.current = new Date();
    spokenTextQueueRef.current = [];
    isSpeakingRef.current = false; // Clear ref immediately like original
    
    try {
      await avatarSynthesizerRef.current.stopSpeakingAsync();
      setSessionState(prev => ({ ...prev, isSpeaking: false }));
      console.log('Stop speaking request sent.');
    } catch (error) {
      console.log('Error occurred while stopping speaking: ' + error);
      setSessionState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  // WebRTC setup function (matches original)
  const setupWebRTC = useCallback(async (iceServerUrl: string, iceServerUsername: string, iceServerCredential: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{
        urls: [iceServerUrl],
        username: iceServerUsername,
        credential: iceServerCredential
      }]
    });

    peerConnectionRef.current = peerConnection;

    peerConnection.ontrack = (event) => {
      console.log(`WebRTC ${event.track.kind} channel connected.`);
      
      const remoteVideoDiv = document.getElementById('remoteVideo');
      if (!remoteVideoDiv) {
        console.error('remoteVideo element not found');
        return;
      }

      if (event.track.kind === 'audio') {
        // Clean up existing audio element if there is any
        const existingAudio = remoteVideoDiv.querySelector('audio');
        if (existingAudio) {
          remoteVideoDiv.removeChild(existingAudio);
        }

        const audioElement = document.createElement('audio');
        audioElement.id = 'audioPlayer';
        audioElement.srcObject = event.streams[0];
        audioElement.autoplay = false;
        audioElement.addEventListener('loadeddata', () => {
          audioElement.play();
        });

        audioElement.onplaying = () => {
          console.log(`WebRTC ${event.track.kind} channel connected.`);
        };

        remoteVideoDiv.appendChild(audioElement);
      }

      if (event.track.kind === 'video') {
        // Clean up existing video element if there is any
        const existingVideo = remoteVideoDiv.querySelector('video');
        if (existingVideo) {
          remoteVideoDiv.removeChild(existingVideo);
        }

        const videoElement = document.createElement('video');
        videoElement.id = 'videoPlayer';
        videoElement.srcObject = event.streams[0];
        videoElement.autoplay = false;
        videoElement.playsInline = true;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        
        videoElement.addEventListener('loadeddata', () => {
          videoElement.play();
        });

        remoteVideoDiv.appendChild(videoElement);
      }
    };

    peerConnection.addTransceiver('video', { direction: 'sendrecv' });
    peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

    try {
      const result = await avatarSynthesizerRef.current.startAvatarAsync(peerConnection);
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log('Avatar started. Result ID: ' + result.resultId);
        setSessionState(prev => ({ ...prev, isActive: true, isConnecting: false }));
        
        // Simple welcome message when avatar session starts
        setTimeout(() => {
          speak("Hello! I'm Lisa, your Azure Cloud Solution AI Coach. To get started, please describe your customer project scenario and their specific requirements.");
        }, 2000); // Wait 2 seconds for avatar to fully initialize
      } else {
        console.log('Unable to start avatar. Result ID: ' + result.resultId);
        throw new Error('Failed to start avatar');
      }
    } catch (error) {
      console.log('Avatar failed to start. Error: ' + error);
      setSessionState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  // Connect avatar function
  const connectAvatar = useCallback(async () => {
    if (!window.SpeechSDK) {
      console.error('Speech SDK not loaded');
      return;
    }

    setSessionState(prev => ({ ...prev, isConnecting: true }));

    try {
      // Create speech synthesis config
      const speechSynthesisConfig = SpeechSDK.SpeechConfig.fromSubscription(
        FIXED_CONFIG.apiKey,
        FIXED_CONFIG.region
      );

      // Create avatar config
      const avatarConfig = new SpeechSDK.AvatarConfig(
        FIXED_CONFIG.talkingAvatarCharacter,
        FIXED_CONFIG.talkingAvatarStyle
      );

      // Create avatar synthesizer
      avatarSynthesizerRef.current = new SpeechSDK.AvatarSynthesizer(speechSynthesisConfig, avatarConfig);
      
      avatarSynthesizerRef.current.avatarEventReceived = (s: any, e: any) => {
        console.log('Avatar event received: ' + e.description);
      };

      // Create speech recognition config
      const speechRecognitionConfig = SpeechSDK.SpeechConfig.fromEndpoint(
        new URL(`wss://${FIXED_CONFIG.region}.stt.speech.microsoft.com/speech/universal/v2`),
        FIXED_CONFIG.apiKey
      );
      speechRecognitionConfig.setProperty(
        SpeechSDK.PropertyId.SpeechServiceConnection_LanguageIdMode,
        'Continuous'
      );
      
      const sttLocales = FIXED_CONFIG.sttLocales.split(',');
      const autoDetectSourceLanguageConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages(sttLocales);
      speechRecognizerRef.current = SpeechSDK.SpeechRecognizer.FromConfig(
        speechRecognitionConfig,
        autoDetectSourceLanguageConfig,
        SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
      );

      // Get ICE server token
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://${FIXED_CONFIG.region}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`);
      xhr.setRequestHeader('Ocp-Apim-Subscription-Key', FIXED_CONFIG.apiKey);
      
      xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
          const responseData = JSON.parse(this.responseText);
          const iceServerUrl = responseData.Urls[0];
          const iceServerUsername = responseData.Username;
          const iceServerCredential = responseData.Password;
          setupWebRTC(iceServerUrl, iceServerUsername, iceServerCredential);
        }
      };
      
      xhr.send();
      
      if (!messages.length) {
        initMessages();
      }
    } catch (error) {
      console.error('Error connecting avatar:', error);
      setSessionState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [messages.length, initMessages, setupWebRTC]); // Removed projectDetails dependency

  // Disconnect avatar function
  const disconnectAvatar = useCallback(() => {
    if (avatarSynthesizerRef.current) {
      avatarSynthesizerRef.current.close();
      avatarSynthesizerRef.current = null;
    }

    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.stopContinuousRecognitionAsync(() => {}, () => {});
      speechRecognizerRef.current.close();
      speechRecognizerRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setSessionState({
      isActive: false,
      isConnecting: false,
      isSpeaking: false,
      isMicrophoneActive: false,
      showTypeMessage: false
    });
  }, []);

  // Start microphone function
  const startMicrophone = useCallback(() => {
    if (!speechRecognizerRef.current) return;

    lastInteractionTimeRef.current = new Date();

    speechRecognizerRef.current.recognized = async (s: any, e: any) => {
      console.log('DEBUG: Speech recognition result received');
      console.log('DEBUG: Result reason:', e.result.reason);
      console.log('DEBUG: Result text:', e.result.text);
      console.log('DEBUG: Expected RecognizedSpeech reason:', SpeechSDK.ResultReason.RecognizedSpeech);
      
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        let userQuery = e.result.text.trim();
        console.log('DEBUG: User speech recognized successfully:', userQuery);
        console.log('DEBUG: handleUserQueryRef.current exists:', !!handleUserQueryRef.current);
        
        if (userQuery === '') {
          console.log('DEBUG: Empty speech query, ignoring');
          return;
        }

        // Auto stop microphone when a phrase is recognized, when it's not continuous conversation mode
        if (!FIXED_CONFIG.continuousConversation) {
          speechRecognizerRef.current.stopContinuousRecognitionAsync(
            () => {
              setSessionState(prev => ({ ...prev, isMicrophoneActive: false }));
            }, (err: any) => {
              console.log('Failed to stop continuous recognition:', err);
            }
          );
        }

        if (handleUserQueryRef.current) {
          console.log('DEBUG: Calling handleUserQuery with:', userQuery);
          handleUserQueryRef.current(userQuery);
        } else {
          console.error('DEBUG: handleUserQueryRef.current is null!');
        }
      }
    };

    // Add error handler and more detailed logging
    speechRecognizerRef.current.recognizing = (s: any, e: any) => {
      console.log('DEBUG: Speech recognizing (partial):', e.result.text);
    };

    speechRecognizerRef.current.canceled = (s: any, e: any) => {
      console.error('DEBUG: Speech recognition canceled');
      console.error('DEBUG: Cancel reason:', e.reason);
      console.error('DEBUG: Error details:', e.errorDetails);
    };

    speechRecognizerRef.current.sessionStarted = (s: any, e: any) => {
      console.log('DEBUG: Speech recognition session started');
    };

    speechRecognizerRef.current.sessionStopped = (s: any, e: any) => {
      console.log('DEBUG: Speech recognition session stopped');
    };

    speechRecognizerRef.current.startContinuousRecognitionAsync(
      () => {
        console.log('DEBUG: Speech recognition started successfully');
        setSessionState(prev => ({ ...prev, isMicrophoneActive: true }));
      },
      (err: any) => {
        console.error('DEBUG: Failed to start continuous recognition:', err);
      }
    );
  }, []);

  const stopMicrophone = useCallback(() => {
    if (!speechRecognizerRef.current) return;

    speechRecognizerRef.current.stopContinuousRecognitionAsync(
      () => {
        setSessionState(prev => ({ ...prev, isMicrophoneActive: false }));
      },
      (err: any) => {
        console.error('Failed to stop continuous recognition:', err);
      }
    );
  }, []);

  // Handle user query - UPDATED TO USE FASTAPI WITH PROPER CHAT HISTORY
  const handleUserQuery = useCallback(async (userQuery: string) => {
    lastInteractionTimeRef.current = new Date();

    console.log('DEBUG: handleUserQuery called with:', userQuery);

    // CRITICAL: Stop previous speaking if there is any (matches original exactly)
    if (isSpeakingRef.current) {
      await stopSpeaking();
    }

    // Create user message for our local state
    const userMessage: ChatMessage = {
      role: 'user',
      content: userQuery
    };

    // Update messages state with user message
    setMessages(prev => [...prev, userMessage]);

    try {
      // Check if this looks like a diagram request
      // const isDiagramRequest = /draw|diagram|/i.test(userQuery);
      
      // if (isDiagramRequest) {
      //   // Custom speech for diagram generation start
      //   speak("Your diagram is being generated.");
      // }

      // Call the FastAPI endpoint
      const response = await callFastAPIChat(userQuery);
      
      console.log('DEBUG: FastAPI response:', response);

      if (response.type === 'text') {
        // Handle text response - add to messages state only (conversation history is built from messages)
        const assistantReply = response.answer || '(no answer)';
        
        // Add assistant message to our local state (for React display and future conversation context)
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: assistantReply
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Note: No need to separately manage chatHistory string - conversation context 
        // is now built from messages array in buildConversationContext()

        // Speak the text response using existing TTS logic
        speak(assistantReply);

      } else if (response.type === 'diagram') {
        // Handle diagram response - display image in chat but don't add to chat history
        
        let imageUrl: string;
        
        if (response.directImage) {
          // Direct image blob response
          imageUrl = response.imageUrl;
        } else {
          // Get image from URL or download endpoint
          const downloadUrl = response.download || response.url;
          if (!downloadUrl) {
            console.error('Diagram response missing download URL:', response);
            speak("I generated a diagram but couldn't retrieve the image. Please try again.");
            return;
          }
          
          // Build full URL if needed
          imageUrl = downloadUrl.startsWith('http') ? downloadUrl : `${FASTAPI_BASE_URL}${downloadUrl}`;
        }

        // Display the diagram image in chat
        addDiagramToChat(imageUrl, response.summary);
        
        // Custom speech for diagram completion
        speak("Your Azure architecture is ready.");

        // Note: We deliberately do NOT add diagram responses to chat history
        // as requested by the user - diagrams are visual and don't need to be in text history

      } else {
        // Unknown response type
        console.warn('Unexpected FastAPI response type:', response);
        speak("I received an unexpected response format. Please try again.");
      }

    } catch (error) {
      console.error('Error in handleUserQuery:', error);
      speak("I'm sorry, I encountered an error while processing your request. Please try again.");
    }
  }, [callFastAPIChat, stopSpeaking, speak, addDiagramToChat]); // Updated dependency

  // Update the ref whenever handleUserQuery changes
  useEffect(() => {
    console.log('DEBUG: Updating handleUserQueryRef with new handleUserQuery function');
    handleUserQueryRef.current = handleUserQuery;
  }, [handleUserQuery]);

  // Clear chat history function - updated to clear session
  const clearChatHistory = useCallback(() => {
    setChatHistory('');
    setMessages([]);
    setSessionId(null); // Clear session ID to force new session creation
    initMessages();
  }, [initMessages]);

  // Project details handler - updated to clear session when project changes
  const handleProjectDetailsChange = useCallback((text: string) => {
    console.log('DEBUG: handleProjectDetailsChange called with text length:', text.length);
    console.log('DEBUG: handleProjectDetailsChange text preview:', text.substring(0, 100));
    setProjectDetails(text);
    // Clear session when project details change significantly
    if (sessionId && Math.abs(text.length - projectDetails.length) > 100) {
      setSessionId(null);
    }
  }, [sessionId, projectDetails]);

  const handleProjectDetailsBlur = useCallback((text: string) => {
    console.log('DEBUG: handleProjectDetailsBlur called with text length:', text.length);
    console.log('DEBUG: sessionState.isActive:', sessionState.isActive);
    console.log('DEBUG: sessionState.isSpeaking:', sessionState.isSpeaking);
    
    // Clear session to ensure new project context is used
    if (sessionId && text !== projectDetails) {
      setSessionId(null);
    }
    
    // Provide acknowledgment when user finishes entering substantial content
    if (sessionState.isActive && !sessionState.isSpeaking && text.length > 50) {
      console.log('DEBUG: Conditions met, will speak acknowledgment');
      setTimeout(() => {
        if (text.length > 1000) {
          speak("Perfect! I've received comprehensive customer project details. This excellent level of detail will help me provide you with highly targeted Azure solution recommendations. I'm ready to help you design the optimal architecture for this customer. What would you like to explore first?");
        } else if (text.length > 500) {
          speak("Great! I've captured the customer project information you provided. I'm ready to help you design appropriate Azure solutions based on these requirements. What aspect of the Azure architecture would you like to start with?");
        } else if (text.length > 200) {
          speak("Thank you! I've received the project details. I'm ready to help with Azure solution guidance. Feel free to add more details anytime or ask me about specific Azure services for this project.");
        } else {
          speak("I see you've entered some project information. I'm here to help with Azure solutions whenever you're ready.");
        }
      }, 500);
    } else {
      console.log('DEBUG: Conditions not met for acknowledgment');
      if (!sessionState.isActive) console.log('DEBUG: Avatar not active');
      if (sessionState.isSpeaking) console.log('DEBUG: Avatar is currently speaking');
      if (text.length <= 50) console.log('DEBUG: Text too short:', text.length);
    }
  }, [sessionState.isActive, sessionState.isSpeaking, speak, sessionId, projectDetails]);

  // Toggle type message function
  const toggleTypeMessage = useCallback(() => {
    setSessionState(prev => ({ ...prev, showTypeMessage: !prev.showTypeMessage }));
  }, []);

  return {
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
    speak,
    clearChatHistory,
    toggleTypeMessage,
    handleProjectDetailsChange,
    handleProjectDetailsBlur,
    updateSystemPrompt
  };
};
