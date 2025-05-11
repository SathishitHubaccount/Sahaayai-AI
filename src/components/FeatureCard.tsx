
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon,
  color = "bg-sahaay-blue-light",
  onClick 
}: FeatureCardProps) => {
  return (
    <div 
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
        <Icon className="h-8 w-8 text-sahaay-blue" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-sahaay-text-light text-lg">{description}</p>
    </div>
  );
};

export default FeatureCard;
