
/**
 * Service for Eleven Labs text-to-speech API integration
 */

// Default model ID
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

/**
 * Converts text to speech using Eleven Labs API
 * @param text The text to convert to speech
 * @param voiceId The voice ID to use
 * @returns AudioBuffer to play
 */
export const textToSpeech = async (text: string, voiceId: string): Promise<ArrayBuffer | null> => {
  try {
    const apiKey = localStorage.getItem('elevenLabsApiKey');
    
    if (!apiKey) {
      console.error('ElevenLabs API key not found');
      return null;
    }
    
    // Use default voice if none specified
    const actualVoiceId = voiceId === 'default' ? 'EXAVITQu4vr4xnSDxMaL' : voiceId;
    
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: DEFAULT_MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }
    
    // Return audio data
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    return null;
  }
};

/**
 * Plays audio from array buffer
 * @param audioData Array buffer of audio data
 * @returns Promise that resolves when audio finishes playing
 */
export const playAudio = (audioData: ArrayBuffer): Promise<void> => {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    audioContext.decodeAudioData(audioData, (buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        resolve();
      };
      
      source.start(0);
    });
  });
};