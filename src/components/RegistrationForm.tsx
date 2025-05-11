
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate();
  
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'हिन्दी (Hindi)', code: 'hi' },
    { name: 'ಕನ್ನಡ (Kannada)', code: 'kn' },
    { name: 'తెలుగు (Telugu)', code: 'te' },
    { name: 'தமிழ் (Tamil)', code: 'ta' },
    { name: 'മലയാളം (Malayalam)', code: 'ml' },
    { name: 'বাংলা (Bengali)', code: 'bn' },
    { name: 'मराठी (Marathi)', code: 'mr' },
    { name: 'ગુજરાતી (Gujarati)', code: 'gu' }
  ];
  
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // In a real implementation, this would send an OTP
    toast.success("OTP sent successfully!", {
      description: "A verification code has been sent to your phone.",
    });
    setStep(2);
  };
  
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    
    // In a real implementation, this would verify the OTP
    toast.success("OTP verified successfully!");
    setStep(3);
  };
  
  const handleLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!language) {
      toast.error("Please select your preferred language");
      return;
    }
    
    toast.success(`Language set to ${language}!`);
    setStep(4);
  };
  
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error("Please enter your location");
      return;
    }
    
    // In a real implementation, this would store user data
    toast.success("Registration successful!", {
      description: `Welcome ${name} to SahaayAI, your voice companion.`,
    });
    
    // Save user data to localStorage for use across the app
    const userData = { name, phoneNumber, location, language };
    localStorage.setItem('sahaayUserData', JSON.stringify(userData));
    
    // Simulate loading
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use a reverse geocoding service
          setLocation("Detected location");
          toast.success("Location detected!");
        },
        () => {
          toast.error("Could not detect location", {
            description: "Please enter your location manually.",
          });
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };
  
  return (
    <div className="card max-w-md w-full mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {step === 1 && "Let's Get Started"}
        {step === 2 && "Verify OTP"}
        {step === 3 && "Choose Your Language"}
        {step === 4 && "Set Your Location"}
      </h2>
      
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xl mb-2">Your Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-large"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xl mb-2">Phone Number</label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-large"
            />
          </div>
          <Button type="submit" className="btn-primary w-full">
            Send OTP
          </Button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-xl mb-2">OTP</label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-large"
              maxLength={4}
            />
            <p className="text-sahaay-blue mt-2 text-lg">
              OTP sent to: {phoneNumber}
            </p>
          </div>
          <Button type="submit" className="btn-primary w-full">
            Verify OTP
          </Button>
        </form>
      )}
      
      {step === 3 && (
        <form onSubmit={handleLanguageSubmit} className="space-y-6">
          <div>
            <label htmlFor="language" className="block text-xl mb-2">Select Your Preferred Language</label>
            <div className="flex items-center">
              <Globe className="w-6 h-6 mr-2 text-sahaay-blue" />
              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger className="w-full text-lg py-6">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.name} className="text-lg py-3">
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="btn-primary w-full">
            Continue
          </Button>
        </form>
      )}
      
      {step === 4 && (
        <form onSubmit={handleLocationSubmit} className="space-y-6">
          <div>
            <label htmlFor="location" className="block text-xl mb-2">Your Location</label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-large"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={getCurrentLocation}
              className="mt-2 w-full text-lg py-3"
            >
              Detect My Location
            </Button>
          </div>
          <Button type="submit" className="btn-primary w-full">
            Complete Registration
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
