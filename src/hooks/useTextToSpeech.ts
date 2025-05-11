import { useState } from 'react';
import { textToSpeech, playAudio } from '../services/elevenlabsService';

interface UseTextToSpeechProps {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  isMuted: boolean;
  speak: (
    text: string,
    voiceId: string,
    useElevenLabs: boolean,
    elevenLabsApiKey?: string | null
  ) => Promise<void>;
  toggleMute: () => boolean;
}

const useTextToSpeech = ({
  onSpeechStart,
  onSpeechEnd
}: UseTextToSpeechProps = {}): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const speak = async (
    text: string,
    voiceId: string,
    useElevenLabs: boolean,
    elevenLabsApiKey?: string | null
  ) => {
    if (isMuted) return;

    setIsSpeaking(true);
    if (onSpeechStart) onSpeechStart();

    try {
      if (useElevenLabs) {
        if (!elevenLabsApiKey) {
          console.warn("ElevenLabs API key is missing. Falling back to browser TTS.");
          useBrowserTTS(text);
        } else {
          const audioData = await textToSpeech(text, voiceId, elevenLabsApiKey);

          if (audioData) {
            await playAudio(audioData);
          } else {
            console.warn("No audio data from ElevenLabs, falling back to browser TTS.");
            useBrowserTTS(text);
          }
        }
      } else {
        useBrowserTTS(text);
      }
    } catch (error) {
      console.error('Error with TTS:', error);
      useBrowserTTS(text);
    } finally {
      setIsSpeaking(false);
      if (onSpeechEnd) onSpeechEnd();
    }
  };

  const useBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.rate = 0.9;
      speech.pitch = 1.0;
      speech.volume = 1.0;

      speech.onend = () => {
        setIsSpeaking(false);
        if (onSpeechEnd) onSpeechEnd();
      };

      window.speechSynthesis.speak(speech);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (newMutedState) {
      window.speechSynthesis.cancel(); // Stop ongoing speech
    }
    return newMutedState;
  };

  return {
    isSpeaking,
    isMuted,
    speak,
    toggleMute
  };
};

export default useTextToSpeech;
