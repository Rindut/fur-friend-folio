
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PetData } from '@/components/ui/PetProfileCard';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PetProfilesSection from '@/components/home/PetProfilesSection';
import CtaSection from '@/components/home/CtaSection';
import { getHomeTranslations } from '@/components/home/HomeTranslations';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();
  const translations = getHomeTranslations();
  const t = translations[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const formattedPets: PetData[] = data.map(pet => ({
            id: pet.id,
            name: pet.name,
            species: pet.species as 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other',
            breed: pet.breed || undefined,
            age: pet.age || undefined,
            imageUrl: pet.image_url || undefined
          }));
          
          setPets(formattedPets);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection t={t} language={language} />

      {/* Features Section */}
      <FeaturesSection t={t} mounted={mounted} />

      {/* Pet Profiles Section */}
      {user && (
        <PetProfilesSection t={t} pets={pets} loading={loading} />
      )}

      {/* CTA Section */}
      <CtaSection t={t} />
    </div>
  );
};

export default Index;
