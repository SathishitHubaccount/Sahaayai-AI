
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import WaveAnimation from './WaveAnimation';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface VoiceAssistantProps {
  welcomeMessage?: string;
}

const VoiceAssistant = ({ 
  welcomeMessage = "Hello! I'm SahaayAI, your voice companion. How can I help you today?" 
}: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(welcomeMessage);
  const [userName, setUserName] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'assistant', text: string}[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [delayValue, setDelayValue] = useState(5); // Default 5 seconds
  const [isInDelay, setIsInDelay] = useState(false);
  const [delayTimerId, setDelayTimerId] = useState<number | null>(null);
  
  // Load user data and settings from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('sahaayUserData');
    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);
      
      // Add welcome message to chat history
      const personalizedWelcome = welcomeMessage.replace("Hello!", `Hello${name ? ', ' + name : ''}!`);
      setChatHistory([{type: 'assistant', text: personalizedWelcome}]);
      setResponse(personalizedWelcome);
    } else {
      setChatHistory([{type: 'assistant', text: welcomeMessage}]);
    }

    // Load saved delay setting if exists
    const savedDelay = localStorage.getItem('sahaayDelayPreference');
    if (savedDelay) {
      setDelayValue(Number(savedDelay));
    }
  }, [welcomeMessage]);
  
  // Setup Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access is required for voice assistant");
        }
        setIsListening(false);
        setIsInDelay(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening && !isInDelay) {
          // If still listening and not in delay, restart recognition
          recognitionRef.current?.start();
        }
      };
    } else {
      toast.error("Speech recognition is not supported in this browser");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Clear any existing delay timer when component unmounts
      if (delayTimerId) {
        window.clearTimeout(delayTimerId);
      }
    };
  }, [isListening, isInDelay]);
  
  // Effect to handle transcript changes and generate responses
  useEffect(() => {
    let timeoutId: number;
    
    if (transcript && isListening) {
      // Add a delay before processing to allow the user to finish speaking
      timeoutId = window.setTimeout(() => {
        // Add user's speech to chat history
        setChatHistory(prev => [...prev, {type: 'user', text: transcript}]);
        handleVoiceCommand(transcript);
      }, 1500);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [transcript, isListening]);
  
  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    // Examples of handling different intents
    const normalizedCommand = command.toLowerCase();
    let responseText = "";
    
    // In a real implementation, this would use NLP or LLM API
    if (normalizedCommand.includes('hello') || normalizedCommand.includes('hi')) {
      responseText = `Hello${userName ? ', ' + userName : ''}! How can I help you today?`;
    } else if (normalizedCommand.includes('music') || normalizedCommand.includes('song')) {
      responseText = `I can play music for you${userName ? ', ' + userName : ''}. What type of music would you like to listen to?`;
    } else if (normalizedCommand.includes('news')) {
      responseText = `I can read today's top news headlines for you${userName ? ', ' + userName : ''}. Would you like national news or local news?`;
    } else if (normalizedCommand.includes('medicine') || normalizedCommand.includes('reminder')) {
      responseText = `I can set medicine reminders for you${userName ? ', ' + userName : ''}. What time do you need to take your medicine?`;
    } else if (normalizedCommand.includes('help')) {
      responseText = `Don't worry${userName ? ', ' + userName : ''}, I'm here to help. Do you need emergency assistance or just general help with the app?`;
    } else {
      responseText = `I'm sorry${userName ? ', ' + userName : ''}, I didn't quite understand that. Could you please repeat?`;
    }
    
    speakResponse(responseText);
    
    // Reset transcript after processing
    setTranscript('');
  };
  
  // Text-to-speech function
  const speakResponse = (text: string) => {
    setResponse(text);
    // Add assistant's response to chat history
    setChatHistory(prev => [...prev, {type: 'assistant', text}]);
    
    if (!isMuted && 'speechSynthesis' in window) {
      // Stop listening while speaking
      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsInDelay(true);
      }
      
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.rate = 0.9; // Slightly slower rate for seniors
      speech.pitch = 1.0;
      speech.volume = 1.0;
      
      // When speech ends, start the delay before listening again
      speech.onend = () => {
        if (isListening) {
          toast.info(`Taking a moment... I'll listen again in ${delayValue} seconds`);
          
          // Set a timer for the configured delay
          const timerId = window.setTimeout(() => {
            if (isListening) {
              setIsInDelay(false);
              // Play a soft chime or show notification
              const chime = new Audio('/notification-sound.mp3'); // You would need to add this file
              chime.volume = 0.3;
              chime.play().catch(e => console.log("Audio play failed:", e));
              
              toast.info("Listening...");
              if (recognitionRef.current) {
                recognitionRef.current.start();
              }
            }
            setDelayTimerId(null);
          }, delayValue * 1000);
          
          setDelayTimerId(timerId);
        }
      };
      
      window.speechSynthesis.speak(speech);
    } else if (isListening) {
      // If muted but listening, still implement the delay
      setIsInDelay(true);
      toast.info(`Taking a moment... I'll listen again in ${delayValue} seconds`);
      
      const timerId = window.setTimeout(() => {
        if (isListening) {
          setIsInDelay(false);
          toast.info("Listening...");
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }
        setDelayTimerId(null);
      }, delayValue * 1000);
      
      setDelayTimerId(timerId);
    }
  };
  
  // Toggle listening
  const toggleListening = () => {
    // Cancel any existing delay timer when manually toggling
    if (delayTimerId) {
      window.clearTimeout(delayTimerId);
      setDelayTimerId(null);
    }
    
    if (!isListening) {
      setIsListening(true);
      setIsInDelay(false);
      setTranscript('');
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      toast.info("Listening...");
    } else {
      setIsListening(false);
      setIsInDelay(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      toast.info("Stopped listening");
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel(); // Stop any current speech
      toast.info("Voice responses muted");
    } else {
      toast.info("Voice responses unmuted");
    }
  };
  
  // Update delay preference
  const updateDelayPreference = (value: number[]) => {
    const newDelay = value[0];
    setDelayValue(newDelay);
    // Save preference to localStorage
    localStorage.setItem('sahaayDelayPreference', newDelay.toString());
    toast.info(`Response delay updated to ${newDelay} seconds`);
  };
  
  return (
    <div className="card flex flex-col items-center">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-3">SahaayAI</h2>
        <p className="text-xl text-sahaay-text-light">
          {userName ? `Hello, ${userName}! I'm your Voice Companion` : 'Your Voice Companion'}
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center w-full mb-6">
        {isInDelay ? (
          <div className="h-12 flex items-center justify-center mb-4">
            <div className="text-sahaay-purple text-lg">
              Taking a moment...
            </div>
          </div>
        ) : (
          <WaveAnimation isListening={isListening} className="mb-4" />
        )}
        
        <div className="bg-sahaay-blue-light rounded-xl p-4 w-full max-w-lg mb-4 overflow-y-auto" style={{ minHeight: "200px", maxHeight: "300px" }}>
          {chatHistory.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`${
                    message.type === 'user' 
                      ? 'bg-sahaay-blue text-white self-end' 
                      : 'bg-white text-sahaay-text self-start'
                  } p-3 rounded-lg max-w-[80%] shadow`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl">{response}</p>
          )}
        </div>
        
        <div className="text-lg text-sahaay-text-light mb-8">
          {isInDelay 
            ? `I'll listen again in ${delayValue} seconds${userName ? ', ' + userName : ''}` 
            : isListening 
              ? `I'm listening${userName ? ', ' + userName : ''}... Speak now` 
              : `Tap the microphone to speak${userName ? ', ' + userName : ''}`}
        </div>
        
        <div className="flex gap-6">
          <button
            onClick={toggleListening}
            className={`${
              isListening ? 'bg-sahaay-orange' : 'bg-sahaay-blue'
            } rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:opacity-90 transition-all`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className={`${
              isMuted ? 'bg-sahaay-text-light' : 'bg-sahaay-purple'
            } rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:opacity-90 transition-all`}
          >
            {isMuted ? (
              <VolumeX className="h-8 w-8 text-white" />
            ) : (
              <Volume2 className="h-8 w-8 text-white" />
            )}
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="bg-sahaay-blue-light rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
              >
                <Settings className="h-8 w-8 text-sahaay-blue" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Response Delay</h3>
                <p className="text-sm text-sahaay-text-light">
                  Adjust how long to wait after I speak before listening again.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>1s</span>
                    <span>{delayValue}s</span>
                    <span>10s</span>
                  </div>
                  <Slider
                    defaultValue={[delayValue]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={updateDelayPreference}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
