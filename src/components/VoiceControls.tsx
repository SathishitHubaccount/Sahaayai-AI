
import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import VoiceSelector from './VoiceSelector';

interface Voice {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'celebrity' | 'custom';
}

interface VoiceControlsProps {
  isListening: boolean;
  isMuted: boolean;
  delayValue: number;
  onToggleListening: () => void;
  onToggleMute: () => void;
  onDelayChange: (value: number[]) => void;
  onVoiceSelect: (voice: Voice) => void;
  currentVoiceId: string;
  retro?: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isMuted,
  delayValue,
  onToggleListening,
  onToggleMute,
  onDelayChange,
  onVoiceSelect,
  currentVoiceId,
  retro = false
}) => {
  return (
    <div className="flex gap-4 items-center">
      {retro ? (
        // Retro styling
        <>
          <button
            onClick={onToggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-black
              ${isListening ? 'bg-red-600' : 'bg-green-600'}`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          <button 
            onClick={onToggleMute} 
            className="bg-yellow-400 text-black p-4 rounded-full border-2 border-black"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-blue-300 text-black p-4 rounded-full border-2 border-black">
                <Settings size={24} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-white border-2 border-black p-4 font-mono">
              <h4 className="font-bold text-xl mb-2">Response Delay</h4>
              <p className="text-sm text-gray-700 mb-3">Adjust delay before listening resumes.</p>
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
                  onValueChange={onDelayChange}
                />
              </div>
              
              <VoiceSelector 
                onVoiceSelect={onVoiceSelect}
                currentVoiceId={currentVoiceId}
                retro={true}
              />
            </PopoverContent>
          </Popover>
        </>
      ) : (
        // Regular styling
        <>
          <button
            onClick={onToggleListening}
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
            onClick={onToggleMute}
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
              <div className="space-y-6">
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
                      onValueChange={onDelayChange}
                    />
                  </div>
                </div>
                
                <VoiceSelector 
                  onVoiceSelect={onVoiceSelect}
                  currentVoiceId={currentVoiceId}
                />
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
};

export default VoiceControls;