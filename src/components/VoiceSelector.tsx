
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Voice {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'celebrity' | 'custom';
}

const VOICE_OPTIONS: Voice[] = [
  // Default voices
  { id: 'default', name: 'Default', description: 'Default assistant voice', category: 'default' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Deep male voice', category: 'default' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Friendly female voice', category: 'default' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Warm female voice', category: 'default' },
  
  // Celebrity-like voices
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Deep authoritative voice (Morgan Freeman-like)', category: 'celebrity' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Clear British accent (Emma Watson-like)', category: 'celebrity' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'British male voice (Hugh Grant-like)', category: 'celebrity' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Warm female voice (Scarlett Johansson-like)', category: 'celebrity' },
];

interface VoiceSelectorProps {
  onVoiceSelect: (voice: Voice) => void;
  currentVoiceId: string;
  retro?: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onVoiceSelect, currentVoiceId, retro = false }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySet, setIsKeySet] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if API key is already stored
    const savedApiKey = localStorage.getItem('elevenLabsApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsKeySet(true);
    }
    
    // Load saved voice preference
    const savedVoice = localStorage.getItem('sahaaySelectedVoice');
    if (savedVoice && JSON.parse(savedVoice).id !== currentVoiceId) {
      const voice = JSON.parse(savedVoice);
      onVoiceSelect(voice);
    }
  }, [onVoiceSelect, currentVoiceId]);
  
  const handleVoiceSelect = (voiceId: string) => {
    if (!isKeySet) {
      toast.error("Please set your ElevenLabs API key first");
      return;
    }
    
    const selectedVoice = VOICE_OPTIONS.find(v => v.id === voiceId);
    if (selectedVoice) {
      // Save to localStorage for persistence
      localStorage.setItem('sahaaySelectedVoice', JSON.stringify(selectedVoice));
      onVoiceSelect(selectedVoice);
      toast.success(`Voice changed to ${selectedVoice.name}`);
    }
  };
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('elevenLabsApiKey', apiKey);
      setIsKeySet(true);
      toast.success("ElevenLabs API key saved");
    } else {
      toast.error("Please enter a valid API key");
    }
  };
  
  const currentVoice = VOICE_OPTIONS.find(v => v.id === currentVoiceId) || VOICE_OPTIONS[0];

  if (retro) {
    return (
      <div className="space-y-4 mt-6">
        <h4 className="font-bold text-xl mb-2">Voice Selection</h4>
        
        {!isKeySet ? (
          <div className="bg-yellow-100 border-2 border-yellow-600 p-3 rounded-md">
            <p className="text-black text-sm mb-2">
              To use premium voices, you need an ElevenLabs API key.
              <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-blue-800 underline ml-1 font-bold">
                Get one here
              </a>
            </p>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter ElevenLabs API key"
                className="flex h-9 w-full rounded border-2 border-black bg-white px-3 py-1 text-sm"
              />
              <button 
                onClick={saveApiKey} 
                className="bg-green-600 text-white border-2 border-black rounded px-3 py-1 text-sm font-bold"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <select
              className="w-full p-2 border-2 border-black rounded"
              value={currentVoice.id}
              onChange={(e) => handleVoiceSelect(e.target.value)}
            >
              <optgroup label="Default Voices">
                {VOICE_OPTIONS.filter(v => v.category === 'default').map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Celebrity-like Voices">
                {VOICE_OPTIONS.filter(v => v.category === 'celebrity').map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.description}
                  </option>
                ))}
              </optgroup>
            </select>
            
            <button
              onClick={() => {
                setIsKeySet(false);
                localStorage.removeItem('elevenLabsApiKey');
                toast.info("API key removed");
              }}
              className="mt-2 bg-red-500 text-white border-2 border-black rounded px-3 py-1 text-sm font-bold"
            >
              Change API Key
            </button>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Voice Selection</h3>
        
        {!isKeySet ? (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
            <p className="text-amber-800 text-sm mb-2">
              To use voice options, you need an ElevenLabs API key.
              <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">
                Get one here
              </a>
            </p>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter ElevenLabs API key"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button onClick={saveApiKey} size="sm">Save</Button>
            </div>
          </div>
        ) : (
          <Select onValueChange={handleVoiceSelect} defaultValue={currentVoice.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <div className="mb-2 px-2">
                <h4 className="text-sm font-semibold">Default Voices</h4>
              </div>
              {VOICE_OPTIONS.filter(v => v.category === 'default').map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{voice.name}</span>
                    <span className="text-gray-500 text-xs">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
              
              <div className="my-2 px-2">
                <h4 className="text-sm font-semibold">Celebrity-like Voices</h4>
              </div>
              {VOICE_OPTIONS.filter(v => v.category === 'celebrity').map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{voice.name}</span>
                    <span className="text-gray-500 text-xs">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {isKeySet && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                Change API Key
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Update ElevenLabs API Key</h4>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter new API key"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button onClick={saveApiKey} size="sm">Update</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default VoiceSelector;