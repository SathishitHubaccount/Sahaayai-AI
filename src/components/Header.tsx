
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  showLanguageSelector?: boolean;
}

const Header = ({ showLanguageSelector = true }: HeaderProps) => {
  const [language, setLanguage] = useState('English');
  
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'हिन्दी (Hindi)', code: 'hi' },
    { name: 'ಕನ್ನಡ (Kannada)', code: 'ka' },
  ];

  return (
    <header className="py-4 px-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-sahaay-purple rounded-full w-10 h-10 flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <h1 className="text-2xl font-bold text-sahaay-blue">SahaayAI</h1>
      </Link>
      
      {showLanguageSelector && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-lg px-4 py-2 rounded-full border-2 border-sahaay-blue-light">
            <Globe className="h-5 w-5 text-sahaay-blue" />
            <span>{language}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg rounded-xl border-none p-2 min-w-[180px]">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                className="text-lg py-3 px-4 rounded-lg hover:bg-sahaay-blue-light cursor-pointer"
                onClick={() => setLanguage(lang.name)}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
