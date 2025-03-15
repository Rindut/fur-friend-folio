
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PawPrint, CalendarClock, Heart, Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/ui/PetAvatar';

interface PetDetails {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight?: string;
  birthday?: string;
  imageUrl?: string;
  notes?: string;
}

// Sample data
const samplePets: Record<string, PetDetails> = {
  '1': {
    id: '1',
    name: 'Luna',
    species: 'dog',
    breed: 'Golden Retriever',
    age: '3 years',
    weight: '65 lbs',
    birthday: 'March 15, 2020',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    notes: 'Luna is a friendly and energetic Golden Retriever who loves to play fetch and swim. She is good with children and other dogs.'
  },
  '2': {
    id: '2',
    name: 'Oliver',
    species: 'cat',
    breed: 'Siamese',
    age: '2 years',
    weight: '10 lbs',
    birthday: 'June 22, 2021',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    notes: 'Oliver is a curious and playful Siamese cat. He enjoys climbing and exploring new places. He can be shy around strangers but is very affectionate with family.'
  }
};

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (id && samplePets[id]) {
        setPet(samplePets[id]);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse-gentle">Loading pet profile...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container px-4 mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pet Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the pet you're looking for.
          </p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/dashboard" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </Button>

      <div className="glass-morphism rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <PetAvatar
            src={pet.imageUrl}
            name={pet.name}
            size="xl"
            className="flex-shrink-0"
          />
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Edit className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Species:</span> {pet.species}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Breed:</span> {pet.breed}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Age:</span> {pet.age}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Weight:</span> {pet.weight}
              </div>
              {pet.birthday && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">Birthday:</span> {pet.birthday}
                </div>
              )}
            </div>
            
            {pet.notes && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">About {pet.name}</h3>
                <p className="text-muted-foreground">{pet.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="text-coral w-5 h-5" /> Health Records
          </h2>
          <Link to={`/health?pet=${pet.id}`} className="text-coral hover:text-coral/80 font-medium">
            View Health Records
          </Link>
        </div>
        
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PawPrint className="text-sage w-5 h-5" /> Care Reminders
          </h2>
          <Link to={`/reminders?pet=${pet.id}`} className="text-sage hover:text-sage/80 font-medium">
            View Care Reminders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
