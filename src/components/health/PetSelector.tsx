
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PetAvatar from '@/components/ui/PetAvatar';

interface Pet {
  id: string;
  name: string;
  imageUrl?: string;
  species?: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
}

interface PetSelectorProps {
  pets: Pet[];
  selectedPet: string;
  onPetChange: (petId: string) => void;
  selectPetLabel: string;
  loading?: boolean;
  loadingText?: string;
}

const PetSelector = ({
  pets,
  selectedPet,
  onPetChange,
  selectPetLabel,
  loading = false,
  loadingText = 'Loading...'
}: PetSelectorProps) => {
  if (loading) {
    return <div className="mb-8 text-center">{loadingText}</div>;
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <p className="font-medium">{selectPetLabel}:</p>
        <div className="md:w-64">
          <Select value={selectedPet} onValueChange={onPetChange}>
            <SelectTrigger>
              <SelectValue placeholder={selectPetLabel} />
            </SelectTrigger>
            <SelectContent>
              {pets.map(pet => (
                <SelectItem key={pet.id} value={pet.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <PetAvatar 
                      src={pet.imageUrl} 
                      name={pet.name} 
                      size="sm" 
                      species={pet.species || 'other'} 
                    />
                    <span>{pet.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {pets.map(pet => (
          <button
            key={pet.id}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
              selectedPet === pet.id 
                ? 'bg-lavender/30 text-charcoal' 
                : 'bg-white/70 text-muted-foreground hover:bg-lavender/10'
            }`}
            onClick={() => onPetChange(pet.id)}
          >
            <PetAvatar 
              src={pet.imageUrl} 
              name={pet.name} 
              size="sm" 
              species={pet.species || 'other'} 
            />
            <span>{pet.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PetSelector;
