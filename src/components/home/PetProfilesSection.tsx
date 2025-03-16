
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetProfileCard, { PetData } from '@/components/ui/PetProfileCard';
import AddPetButton from '@/components/ui/AddPetButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface PetProfilesSectionProps {
  t: Record<string, string>;
  pets: PetData[];
  loading: boolean;
}

const PetProfilesSection = ({ t, pets, loading }: PetProfilesSectionProps) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <section className="py-16 bg-cream/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <h2 className="section-heading">{t.petFamily}</h2>
          <Link to="/dashboard" className="text-coral hover:text-coral/80 font-medium flex items-center gap-1">
            {t.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Pet Parent Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-sage" /> {t.petParent}
          </h3>
          <div className="glass-morphism rounded-xl p-5 flex items-center">
            <Avatar className="h-12 w-12 mr-4 border border-sage/20">
              <AvatarFallback className="bg-sage/20 text-sage">
                {user ? user.email.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{user.user_metadata?.username || 'Pet Parent'}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Link to="/profile" className="ml-auto">
              <Button variant="outline" size="sm" className="rounded-full">
                <User className="w-4 h-4 mr-1" />
                <span>Profile</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Pets Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-coral" /> {t.yourPets}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading pets...</div>
            ) : pets.length > 0 ? (
              <>
                {pets.slice(0, 2).map(pet => (
                  <PetProfileCard key={pet.id} pet={pet} />
                ))}
                <AddPetButton />
              </>
            ) : (
              <div className="col-span-full flex flex-col items-center py-8">
                <p className="text-muted-foreground mb-4">No pets added yet. Add your first pet!</p>
                <AddPetButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetProfilesSection;
