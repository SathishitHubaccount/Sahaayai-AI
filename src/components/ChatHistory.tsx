
import React from 'react';

interface Message {
  type: 'user' | 'assistant';
  text: string;
}

interface ChatHistoryProps {
  messages: Message[];
  currentTranscript?: string;
  retro?: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  messages, 
  currentTranscript,
  retro = false 
}) => {
  if (retro) {
    return (
      <div className="bg-white border-2 border-black p-4 rounded-md w-full max-w-lg h-64 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-md mb-3 border-2 max-w-[85%] text-lg font-bold leading-6
              ${msg.type === 'user'
                ? 'ml-auto bg-yellow-200 border-yellow-700 text-black'
                : 'mr-auto bg-cyan-100 border-cyan-800 text-black'}`}
          >
            {msg.text}
          </div>
        ))}
        {currentTranscript && (
          <div className="italic text-gray-700 text-lg">{currentTranscript}</div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full max-w-lg h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 border border-gray-200">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`mb-3 max-w-[80%] ${
            msg.type === 'user' ? 'ml-auto text-right' : 'mr-auto'
          }`}
        >
          <div
            className={`inline-block rounded-lg px-4 py-2 ${
              msg.type === 'user'
                ? 'bg-sahaay-blue text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.text}
          </div>
          <div className="text-xs mt-1 text-sahaay-text-light">
            {msg.type === 'user' ? 'You' : 'SahaayAI'}
          </div>
        </div>
      ))}
      {currentTranscript && (
        <div className="italic text-sahaay-text-light text-sm ml-2">
          {currentTranscript}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;