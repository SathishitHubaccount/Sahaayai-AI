import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Voice {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'celebrity' | 'custom';
}

interface VoiceAssistantOptions {
  welcomeMessage: string;
}

interface Message {
  type: 'user' | 'assistant';
  text: string;
}

const useVoiceAssistant = ({ welcomeMessage }: VoiceAssistantOptions) => {
  const [response, setResponse] = useState(welcomeMessage);
  const [userName, setUserName] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [delayValue, setDelayValue] = useState(5);
  const [isInDelay, setIsInDelay] = useState(false);
  const [delayTimerId, setDelayTimerId] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice>({
    id: 'default',
    name: 'Default',
    description: 'Default assistant voice',
    category: 'default'
  });
  const [useElevenLabs, setUseElevenLabs] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('sahaayUserData');
    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);
      const personalizedWelcome = welcomeMessage.replace("Hello!", `Hello${name ? ', ' + name : ''}!`);
      setChatHistory([{ type: 'assistant', text: personalizedWelcome }]);
      setResponse(personalizedWelcome);
    } else {
      setChatHistory([{ type: 'assistant', text: welcomeMessage }]);
    }

    const savedDelay = localStorage.getItem('sahaayDelayPreference');
    if (savedDelay) {
      setDelayValue(Number(savedDelay));
    }

    const savedApiKey = localStorage.getItem('elevenLabsApiKey');
    if (savedApiKey) {
      setUseElevenLabs(true);
      setElevenLabsApiKey(savedApiKey);
    }

    const savedVoice = localStorage.getItem('sahaaySelectedVoice');
    if (savedVoice) {
      setSelectedVoice(JSON.parse(savedVoice));
    }
  }, [welcomeMessage]);

  const handleVoiceCommand = async (command: string) => {
    const normalizedCommand = command.toLowerCase();
    let responseText = "";

    try {
      const backendUrl = 'http://localhost:5000/api/voice-assistant';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: normalizedCommand })
      });

      const data = await res.json();
      if (res.ok && data && data.response) {
        responseText = data.response;
      } else {
        responseText = `Sorry${userName ? ', ' + userName : ''}, I couldn't get a proper response.`;
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      responseText = `Something went wrong while trying to answer${userName ? ', ' + userName : ''}.`;
    }

    return responseText;
  };

  const updateDelayPreference = (value: number[]) => {
    const newDelay = value[0];
    setDelayValue(newDelay);
    localStorage.setItem('sahaayDelayPreference', newDelay.toString());
    toast.info(`Response delay updated to ${newDelay} seconds`);
  };

  const handlePostSpeechDelay = (isListeningActive: boolean, onDelayEnd: () => void) => {
    if (!isListeningActive) return;

    setIsInDelay(true);
    toast.info(`Taking a moment... I'll listen again in ${delayValue} seconds`);

    if (delayTimerId) {
      window.clearTimeout(delayTimerId);
    }

    const timerId = window.setTimeout(() => {
      if (isListeningActive) {
        setIsInDelay(false);
        const chime = new Audio('/notification-sound.mp3');
        chime.volume = 0.3;
        chime.play().catch(e => console.log("Audio play failed:", e));
        toast.info("Listening...");
        onDelayEnd();
      }
      setDelayTimerId(null);
    }, delayValue * 1000);

    setDelayTimerId(timerId);
    return timerId;
  };

  const addMessageToHistory = (text: string, type: 'user' | 'assistant') => {
    setChatHistory(prev => [...prev, { type, text }]);
    if (type === 'assistant') {
      setResponse(text);
    }
  };

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
    setUseElevenLabs(true);
    localStorage.setItem('sahaaySelectedVoice', JSON.stringify(voice));
  };

  const updateElevenLabsApiKey = (key: string) => {
    setElevenLabsApiKey(key);
    setUseElevenLabs(true);
    localStorage.setItem('elevenLabsApiKey', key);
    toast.success("ElevenLabs API key saved");
  };

  useEffect(() => {
    return () => {
      if (delayTimerId) {
        window.clearTimeout(delayTimerId);
      }
    };
  }, [delayTimerId]);

  return {
    response,
    userName,
    chatHistory,
    delayValue,
    isInDelay,
    selectedVoice,
    useElevenLabs,
    elevenLabsApiKey,
    handleVoiceCommand,
    updateDelayPreference,
    handlePostSpeechDelay,
    addMessageToHistory,
    handleVoiceSelect,
    updateElevenLabsApiKey,
    setIsInDelay,
    setDelayTimerId,
  };
};

export default useVoiceAssistant;
