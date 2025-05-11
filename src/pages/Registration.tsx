
import Header from '@/components/Header';
import RegistrationForm from '@/components/RegistrationForm';

const Registration = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showLanguageSelector={true} />
      
      <main className="flex-1 container py-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-sahaay-blue">
            Welcome to SahaayAI
          </h1>
          <p className="text-xl text-sahaay-text-light">
            Your personal voice companion for daily wellbeing and assistance.
          </p>
        </div>
        
        <RegistrationForm />
      </main>
    </div>
  );
};

export default Registration;
