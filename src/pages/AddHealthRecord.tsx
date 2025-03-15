
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Pill, Weight, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import PetAvatar from '@/components/ui/PetAvatar';

interface Pet {
  id: string;
  name: string;
  imageUrl?: string;
}

// Sample data
const samplePets: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    name: 'Oliver',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  }
];

const AddHealthRecord = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    petId: '',
    type: '',
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
      success: 'Health record added successfully'
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
      success: 'Catatan kesehatan berhasil ditambahkan'
    }
  };
  
  const t = translations[language];
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally save the data to your backend
    console.log('Saving health record:', formData);
    
    // Show success toast
    toast({
      title: t.success,
      duration: 3000
    });
    
    // Navigate back to health records
    navigate('/health');
  };
  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
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
                      {samplePets.map(pet => (
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
