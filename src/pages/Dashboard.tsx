
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VoiceAssistant from '@/components/VoiceAssistant';
import EmergencyButton from '@/components/EmergencyButton';
import FeatureCard from '@/components/FeatureCard';
import { 
  Music, 
  Activity, 
  Users, 
  ShoppingCart, 
  Shield, 
  BookOpen 
} from 'lucide-react';

const Dashboard = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  
  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('sahaayUserData');
    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);
    }
  }, []);
  
  const features = [
    {
      title: "Entertainment",
      description: "Music, news, and entertainment for you",
      icon: Music,
      color: "bg-sahaay-blue-light",
      mode: "entertainment"
    },
    {
      title: "Wellbeing",
      description: "Health tips and medicine reminders",
      icon: Activity,
      color: "bg-sahaay-purple-light",
      mode: "wellbeing"
    },
    {
      title: "Connect",
      description: "Stay in touch with family and friends",
      icon: Users,
      color: "bg-sahaay-orange bg-opacity-20",
      mode: "connect"
    },
    {
      title: "Shop",
      description: "Voice-assisted shopping for essentials",
      icon: ShoppingCart,
      color: "bg-green-100",
      mode: "shop"
    },
    {
      title: "Safety",
      description: "Scam protection and emergency help",
      icon: Shield,
      color: "bg-red-100",
      mode: "safety"
    },
    {
      title: "Learn",
      description: "Digital learning and skill building",
      icon: BookOpen,
      color: "bg-yellow-100",
      mode: "learn"
    }
  ];
  
  // Get welcome message based on time of day and user's name
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    
    const nameGreeting = userName ? `${greeting}, ${userName}!` : greeting + "!";
    return `${nameGreeting} I'm SahaayAI, your voice companion. How can I help you today?`;
  };
  
  // Get prompt for active mode
  const getModeWelcome = () => {
    const personalization = userName ? `, ${userName}` : "";
    
    switch (activeMode) {
      case "entertainment":
        return `Entertainment mode activated${personalization}. I can play music, suggest movies, or read the latest news. What would you like to do?`;
      case "wellbeing":
        return `Wellbeing mode activated${personalization}. I can provide health tips, set medicine reminders, or guide you through meditation. How can I help?`;
      case "connect":
        return `Social connection mode activated${personalization}. I can help you call family members or teach you how to use social apps. What would you like to do?`;
      case "shop":
        return `Shopping assistant mode activated${personalization}. I can help you order groceries, medicines, or other essentials. What do you need today?`;
      case "safety":
        return `Safety mode activated${personalization}. I can provide tips on avoiding scams or guide you through security features. What would you like to know?`;
      case "learn":
        return `Learning mode activated${personalization}. I can teach you digital skills or help you find information. What would you like to learn today?`;
      default:
        return getWelcomeMessage();
    }
  };
  
  const handleFeatureClick = (mode: string) => {
    setActiveMode(mode);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header showLanguageSelector={true} />
      
      <main className="flex-1 container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <VoiceAssistant welcomeMessage={getModeWelcome()} />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {activeMode ? "Switch Mode" : "Select a Mode"}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.mode}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  color={feature.color}
                  onClick={() => handleFeatureClick(feature.mode)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <EmergencyButton />
    </div>
  );
};

export default Dashboard;
