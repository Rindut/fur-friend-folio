
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Pet {
  id: string;
  name: string;
  imageUrl?: string;
}

interface HealthRecord {
  id: string;
  type: 'vaccination' | 'medication' | 'weight' | 'visit';
  title: string;
  date: string;
  details?: string;
  petId: string;
}

interface UpcomingTask {
  id: string;
  title: string;
  date: string;
  petName: string;
  petId: string;
}

export const useHealthRecords = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, name, image_url')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPets(data.map(pet => ({
            id: pet.id,
            name: pet.name,
            imageUrl: pet.image_url
          })));
          
          // Set the first pet as selected by default
          setSelectedPet(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    
    fetchPets();
  }, [user]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('id, type, title, date, details, pet_id')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const today = new Date();
          const pastRecords: HealthRecord[] = [];
          const futureRecords: UpcomingTask[] = [];
          
          const petMap = new Map<string, string>();
          pets.forEach(pet => petMap.set(pet.id, pet.name));
          
          data.forEach(record => {
            const recordDate = new Date(record.date);
            
            if (recordDate <= today) {
              pastRecords.push({
                id: record.id,
                type: record.type as HealthRecord['type'],
                title: record.title,
                date: format(recordDate, 'MMM d, yyyy'),
                details: record.details,
                petId: record.pet_id
              });
            } else {
              futureRecords.push({
                id: record.id,
                title: record.title,
                date: format(recordDate, 'MMM d, yyyy'),
                petName: petMap.get(record.pet_id) || 'Unknown Pet',
                petId: record.pet_id
              });
            }
          });
          
          setHealthRecords(pastRecords);
          setUpcomingTasks(futureRecords);
        }
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (pets.length > 0) {
      fetchHealthRecords();
    } else {
      setLoading(false);
    }
  }, [user, pets]);

  const filteredHealthRecords = selectedPet 
    ? healthRecords.filter(record => 
        record.petId === selectedPet && 
        (activeTab === 'all' || record.type === activeTab)
      )
    : [];
  
  const filteredUpcomingTasks = selectedPet
    ? upcomingTasks.filter(task => task.petId === selectedPet)
    : [];

  return {
    pets,
    loading,
    selectedPet,
    setSelectedPet,
    activeTab,
    setActiveTab,
    healthRecords: filteredHealthRecords,
    upcomingTasks: filteredUpcomingTasks
  };
};
