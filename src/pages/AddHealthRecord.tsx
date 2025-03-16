
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Droplets, Pill, Weight, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import PetAvatar from '@/components/ui/PetAvatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { compareAsc, parseISO } from 'date-fns';

interface Pet {
  id: string;
  name: string;
  imageUrl?: string;
}

type RecordType = 'vaccination' | 'medication' | 'weight' | 'visit';

const AddHealthRecord = () => {
  const [searchParams] = useSearchParams();
  const petIdFromUrl = searchParams.get('pet');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    petId: petIdFromUrl || '',
    type: 'vaccination' as RecordType,
    title: '',
    date: '',
    details: ''
  });
  
  const translations = {
    en: {
      pageTitle: 'Add Health Record',
      pageDescription: 'Create a new health record for your pet',
      petLabel: 'Select Pet',
      typeLabel: 'Record Type',
      titleLabel: 'Title',
      titlePlaceholder: 'E.g. Rabies Vaccination',
      dateLabel: 'Date',
      detailsLabel: 'Details',
      detailsPlaceholder: 'Add any relevant details or notes',
      cancel: 'Cancel',
      save: 'Save Record',
      types: {
        vaccination: 'Vaccination',
        medication: 'Medication',
        weight: 'Weight',
        visit: 'Vet Visit'
      },
      success: 'Health record added successfully',
      loadingPets: 'Loading pets...'
    },
    id: {
      pageTitle: 'Tambah Catatan Kesehatan',
      pageDescription: 'Buat catatan kesehatan baru untuk hewan peliharaan Anda',
      petLabel: 'Pilih Hewan',
      typeLabel: 'Jenis Catatan',
      titleLabel: 'Judul',
      titlePlaceholder: 'Contoh: Vaksinasi Rabies',
      dateLabel: 'Tanggal',
      detailsLabel: 'Detail',
      detailsPlaceholder: 'Tambahkan detail atau catatan yang relevan',
      cancel: 'Batal',
      save: 'Simpan Catatan',
      types: {
        vaccination: 'Vaksinasi',
        medication: 'Pengobatan',
        weight: 'Berat',
        visit: 'Kunjungan Dokter Hewan'
      },
      success: 'Catatan kesehatan berhasil ditambahkan',
      loadingPets: 'Memuat hewan peliharaan...'
    }
  };
  
  const t = translations[language];
  
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, name, image_url')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setPets(data.map(pet => ({
            id: pet.id,
            name: pet.name,
            imageUrl: pet.image_url
          })));
          
          // If a pet ID was provided in URL and it's valid, set it as selected
          if (petIdFromUrl && data.some(pet => pet.id === petIdFromUrl)) {
            setFormData(prev => ({ ...prev, petId: petIdFromUrl }));
          } else if (data.length > 0 && !petIdFromUrl) {
            // If no pet ID in URL but we have pets, select the first one
            setFormData(prev => ({ ...prev, petId: data[0].id }));
          }
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pets',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user, petIdFromUrl, toast]);
  
  const getTypeIcon = (type: RecordType) => {
    switch (type) {
      case 'vaccination':
        return <Droplets className="w-4 h-4" />;
      case 'medication':
        return <Pill className="w-4 h-4" />;
      case 'weight':
        return <Weight className="w-4 h-4" />;
      case 'visit':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to add a health record',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.petId || !formData.type || !formData.title || !formData.date) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Insert health record into Supabase
      const { data, error } = await supabase
        .from('health_records')
        .insert([
          {
            pet_id: formData.petId,
            type: formData.type,
            title: formData.title,
            date: formData.date,
            details: formData.details || null,
            user_id: user.id
          }
        ])
        .select();
        
      if (error) throw error;

      console.log('Health record saved successfully:', data);
      
      // Show success toast
      toast({
        title: t.success,
        duration: 3000
      });
      
      // Determine which section to navigate to based on date
      const isUpcoming = compareAsc(parseISO(formData.date), new Date()) > 0;
      
      // Navigate back to health records or pet profile with the appropriate hash
      if (formData.petId) {
        const sectionHash = isUpcoming ? '#upcoming-pet-care' : '#pet-care-history';
        navigate(`/health?pet=${formData.petId}${sectionHash}`);
      } else {
        navigate('/health');
      }
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: 'Error',
        description: 'There was an error adding the health record',
        variant: 'destructive',
      });
    }
  };
  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse">{t.loadingPets}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t.pageTitle}</CardTitle>
                <CardDescription>{t.pageDescription}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.petLabel}</label>
                    <div className="flex flex-wrap gap-3">
                      {pets.map(pet => (
                        <button
                          type="button"
                          key={pet.id}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                            formData.petId === pet.id 
                              ? 'bg-lavender/30 text-charcoal' 
                              : 'bg-white/70 text-muted-foreground hover:bg-lavender/10'
                          }`}
                          onClick={() => handleChange('petId', pet.id)}
                        >
                          <PetAvatar 
                            src={pet.imageUrl} 
                            name={pet.name} 
                            size="sm" 
                          />
                          <span>{pet.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.typeLabel}</label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleChange('type', value as RecordType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.typeLabel} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaccination">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            <span>{t.types.vaccination}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medication">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            <span>{t.types.medication}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="weight">
                          <div className="flex items-center gap-2">
                            <Weight className="w-4 h-4" />
                            <span>{t.types.weight}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="visit">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{t.types.visit}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.titleLabel}</label>
                    <Input 
                      placeholder={t.titlePlaceholder} 
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.dateLabel}</label>
                    <Input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.detailsLabel}</label>
                    <Textarea 
                      placeholder={t.detailsPlaceholder} 
                      value={formData.details}
                      onChange={(e) => handleChange('details', e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/health')}
                  >
                    {t.cancel}
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-lavender hover:bg-lavender/90"
                  >
                    {t.save}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHealthRecord;
