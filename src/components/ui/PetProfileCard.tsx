
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Clock } from 'lucide-react';
import PetAvatar from './PetAvatar';

export interface PetData {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
  breed?: string;
  age?: string;
  imageUrl?: string;
  upcomingCare?: {
    type: string;
    date: string;
  };
}

interface PetProfileCardProps {
  pet: PetData;
  className?: string;
}

const PetProfileCard = ({ pet, className }: PetProfileCardProps) => {
  return (
    <Link to={`/pets/${pet.id}`} className="block outline-none">
      <div 
        className={cn(
          'pet-card group glass-morphism',
          'p-5 flex flex-col gap-4 pet-card-hover',
          'border border-slate-200/50',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <PetAvatar 
            src={pet.imageUrl} 
            name={pet.name} 
            size="md" 
          />
          <span className="chip chip-primary">
            {pet.species === 'dog' ? '🐕' : 
             pet.species === 'cat' ? '🐈' : 
             pet.species === 'bird' ? '🦜' : 
             pet.species === 'rabbit' ? '🐇' : 
             pet.species === 'fish' ? '🐠' : '🐾'} {pet.species}
          </span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-coral transition-colors">
            {pet.name}
          </h3>
          {pet.breed && (
            <p className="text-sm text-muted-foreground mt-0.5">{pet.breed}</p>
          )}
        </div>
        
        {pet.upcomingCare && (
          <div className="mt-2 pt-3 border-t border-slate-200/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-coral" />
              <span>Next: {pet.upcomingCare.type}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{pet.upcomingCare.date}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PetProfileCard;
