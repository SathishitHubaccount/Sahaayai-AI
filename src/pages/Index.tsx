
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { HeadphonesIcon, Heart, MessageCircle, ShieldCheck, Music } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showLanguageSelector={true} />
      
      <main className="flex-1 container py-8 px-4 md:py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sahaay-blue">
            SahaayAI: Your Smart Voice Companion
          </h1>
          <p className="text-xl md:text-2xl text-sahaay-text-light mb-8">
            A voice-first assistant designed for golden years.
            No typing needed - just speak naturally.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              Demo Experience
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <div className="w-16 h-16 bg-sahaay-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="h-8 w-8 text-sahaay-blue" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Entertainment</h3>
            <p className="text-sahaay-text-light">Music, news, and entertainment tailored to your preferences.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-sahaay-purple-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-sahaay-purple" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Wellbeing</h3>
            <p className="text-sahaay-text-light">Health tips, medicine reminders, and guided meditation.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-sahaay-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Social Connection</h3>
            <p className="text-sahaay-text-light">Stay connected with family and learn digital skills.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Safety</h3>
            <p className="text-sahaay-text-light">Emergency help and fraud protection to keep you safe.</p>
          </div>
        </div>
        
        <div className="card p-8 mb-12">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-3xl font-bold mb-4">Simple Voice Interface</h2>
              <p className="text-xl mb-4">
                SahaayAI makes technology accessible with a voice-first design.
                Just speak naturally, and our assistant understands your needs.
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="bg-sahaay-blue-light p-1 rounded-full mr-2">✓</span>
                  No typing or complex navigation
                </li>
                <li className="flex items-start">
                  <span className="bg-sahaay-blue-light p-1 rounded-full mr-2">✓</span>
                  Multilingual support (English, Hindi, Kannada)
                </li>
                <li className="flex items-start">
                  <span className="bg-sahaay-blue-light p-1 rounded-full mr-2">✓</span>
                  Emergency help with one command
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-sahaay-purple-light rounded-xl p-6 flex flex-col items-center">
              <Music className="h-16 w-16 text-sahaay-purple mb-4" />
              <p className="text-xl text-center italic">
                "Play some devotional music"
              </p>
              <p className="text-center mt-4">
                Just say what you need, and SahaayAI responds immediately
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-sahaay-blue-light py-8 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-sahaay-blue mb-4">SahaayAI</h2>
          <p className="text-sahaay-text-light mb-6">
            Your Smart Voice Companion for Golden Years
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="text-sahaay-blue hover:underline">
              Register
            </Link>
            <Link to="#" className="text-sahaay-blue hover:underline">
              About
            </Link>
            <Link to="#" className="text-sahaay-blue hover:underline">
              Contact
            </Link>
          </div>
          <p className="mt-8 text-sm text-sahaay-text-light">
            © 2023 SahaayAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
