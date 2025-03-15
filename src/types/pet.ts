
export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  weight?: string;
  birthday?: string;
  notes?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PetFormData = Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const mapDbPetToPet = (dbPet: any): Pet => {
  return {
    id: dbPet.id,
    user_id: dbPet.user_id,
    name: dbPet.name,
    species: dbPet.species,
    breed: dbPet.breed,
    age: dbPet.age,
    weight: dbPet.weight,
    birthday: dbPet.birthday,
    notes: dbPet.notes,
    image_url: dbPet.image_url,
    is_active: dbPet.is_active ?? true,
    created_at: dbPet.created_at,
    updated_at: dbPet.updated_at
  };
};
