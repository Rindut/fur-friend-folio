
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import PetAvatar from './PetAvatar';

export interface PetData {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
  breed?: string;
  age?: string;
  imageUrl?: string;
  isActive?: boolean;
}

interface PetProfileCardProps {
  pet: PetData;
  className?: string;
  compact?: boolean; // New compact mode
}

const PetProfileCard = ({ pet, className, compact = false }: PetProfileCardProps) => {
  return (
    <Link 
      to={`/pets/${pet.id}`}
      className={cn(
        "block glass-morphism rounded-lg p-4 transition-transform hover:scale-[1.01] hover:shadow-md",
        pet.isActive === false && "opacity-60",
        className
      )}
    >
      <div className={cn(
        "flex",
        compact ? "items-center" : "flex-col items-center"
      )}>
        <PetAvatar 
          src={pet.imageUrl} 
          name={pet.name} 
          species={pet.species} 
          size={compact ? "md" : "lg"}
          className={compact ? "mr-4" : "mb-4"} 
        />
        
        <div className={compact ? "flex-1" : "text-center w-full"}>
          <h3 className={cn(
            "font-semibold truncate",
            compact ? "text-base" : "text-lg mt-2"
          )}>
            {pet.name}
          </h3>
          
          {!compact && (
            <div className="mt-1 text-sm text-muted-foreground">
              {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
              {pet.breed ? ` · ${pet.breed}` : ''}
            </div>
          )}
          
          {compact ? (
            <div className="text-xs text-muted-foreground truncate">
              {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
              {pet.breed ? ` · ${pet.breed}` : ''}
              {pet.age ? ` · ${pet.age}` : ''}
            </div>
          ) : (
            pet.age && (
              <div className="mt-1 text-sm text-muted-foreground">
                {pet.age}
              </div>
            )
          )}
          
          {pet.isActive === false && !compact && (
            <div className="mt-2 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 inline-block">
              Inactive
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PetProfileCard;
