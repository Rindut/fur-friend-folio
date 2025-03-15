
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
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PetAvatar from '@/components/ui/PetAvatar';
import { Pet, mapDbPetToPet } from '@/types/pet';
import { HealthRecordFormData } from '@/types/healthRecord';

const AddHealthRecord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPetId = searchParams.get('pet');
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<HealthRecordFormData>({
    pet_id: preSelectedPetId || '',
    type: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    details: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      error: 'Error adding health record. Please try again.'
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
      error: 'Terjadi kesalahan saat menambahkan catatan kesehatan. Silakan coba lagi.'
    }
  };
  
  const t = translations[language];
  
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          const petsList = data.map(pet => mapDbPetToPet(pet));
          setPets(petsList);
          
          // If no pet is preselected but we have pets, select the first one
          if (!preSelectedPetId && petsList.length > 0) {
            setFormData(prev => ({ ...prev, pet_id: petsList[0].id }));
          }
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
        toast({
          title: 'Error loading pets',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user, toast, preSelectedPetId]);
  
  const getTypeIcon = (type: string) => {
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
        title: 'Authentication error',
        description: 'You must be logged in to add a health record',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.pet_id || !formData.type || !formData.title || !formData.date) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save health record to database
      const { data, error } = await supabase
        .from('health_records')
        .insert([{
          ...formData,
          user_id: user.id
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: t.success
      });
      
      // Navigate back to health records
      navigate('/health');
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: t.error,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
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
                            formData.pet_id === pet.id 
                              ? 'bg-lavender/30 text-charcoal' 
                              : 'bg-white/70 text-muted-foreground hover:bg-lavender/10'
                          }`}
                          onClick={() => handleChange('pet_id', pet.id)}
                        >
                          <PetAvatar 
                            src={pet.image_url} 
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
                      onValueChange={(value) => handleChange('type', value)}
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
                      value={formData.details || ''}
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
                    disabled={isSubmitting || !formData.pet_id || !formData.type || !formData.title || !formData.date}
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
