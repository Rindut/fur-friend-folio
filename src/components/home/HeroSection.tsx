
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PawPrint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface HeroSectionProps {
  t: Record<string, string>;
  language: string;
}

const HeroSection = ({ t, language }: HeroSectionProps) => {
  const { user } = useAuth();

  const renderAuthButtons = () => {
    if (user) {
      return (
        <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
          <Link to="/dashboard" className="flex items-center gap-2">
            {t.dashboard} <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      );
    }

    return (
      <>
        <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
          <Link to="/auth" className="flex items-center gap-2">
            {t.signUp} <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full">
          <Link to="/auth" className="flex items-center gap-2">
            {t.signIn}
          </Link>
        </Button>
      </>
    );
  };

  return (
    <section className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-lavender/30 -z-10" />
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            className="max-w-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="chip chip-primary inline-flex items-center mb-4">
              <PawPrint className="w-4 h-4 mr-1" />
              <span>{t.tagline}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {language === 'en' ? 'Keep your pets' : 'Jaga kesayangan Anda agar'}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral to-sage ml-2">
                {t.heading}
              </span>
            </h1>
            
            <p className="text-base text-muted-foreground mb-6">
              {t.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {renderAuthButtons()}
              
              {/* Find Local Services button removed */}
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-lavender/30 rounded-full -z-10 animate-pulse-gentle" />
              <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-sage/30 rounded-full -z-10 animate-pulse-gentle [animation-delay:1s]" />
              <img 
                src="https://images.unsplash.com/photo-1517451330947-7809dead78d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Cat and dog together" 
                className="rounded-2xl shadow-xl object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
