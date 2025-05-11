
import { cn } from "@/lib/utils";

interface WaveAnimationProps {
  isListening: boolean;
  className?: string;
}

const WaveAnimation = ({ isListening, className }: WaveAnimationProps) => {
  if (!isListening) {
    return null;
  }
  
  return (
    <div className={cn("flex items-end justify-center gap-1 h-12", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 bg-sahaay-purple rounded-full animate-wave-${i}`}
          style={{ 
            height: `${Math.random() * 30 + 10}px`, 
            animationDelay: `${i * 0.1}s` 
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
