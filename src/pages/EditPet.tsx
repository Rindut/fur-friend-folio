
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Cat, Dog, Upload, Calendar, ArrowLeft, Toggle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Pet, PetFormData, mapDbPetToPet } from '@/types/pet';

const EditPet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    birthday: '',
    notes: '',
    image_url: '',
    is_active: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const translations = {
    en: {
      pageTitle: 'Edit Pet Profile',
      pageDescription: 'Update information for your pet',
      nameLabel: 'Pet Name',
      namePlaceholder: 'Enter your pet\'s name',
      speciesLabel: 'Species',
      breedLabel: 'Breed',
      breedPlaceholder: 'E.g. Persian, Siamese, Golden Retriever',
      ageLabel: 'Age',
      agePlaceholder: 'E.g. 3 years',
      weightLabel: 'Weight',
      weightPlaceholder: 'E.g. 5 kg',
      birthdayLabel: 'Birthday',
      photoLabel: 'Photo',
      photoPlaceholder: 'Upload a photo of your pet',
      notesLabel: 'Notes',
      notesPlaceholder: 'Special needs, preferences, or other information',
      back: 'Back to Profile',
      save: 'Save Changes',
      choosePhoto: 'Choose Photo',
      activeLabel: 'Active Status',
      activeDescription: 'Toggle if your pet is currently active',
      species: {
        cat: 'Cat',
        dog: 'Dog',
        other: 'Other'
      },
      successMsg: 'Pet profile updated successfully!',
      errorMsg: 'Error updating pet profile. Please try again.',
      notFoundMsg: 'Pet not found',
      loadingMsg: 'Loading pet profile...'
    },
    id: {
      pageTitle: 'Edit Profil Hewan',
      pageDescription: 'Perbarui informasi untuk kesayangan Anda',
      nameLabel: 'Nama Hewan',
      namePlaceholder: 'Masukkan nama hewan Anda',
      speciesLabel: 'Jenis',
      breedLabel: 'Ras',
      breedPlaceholder: 'Contoh: Persia, Siam, Golden Retriever',
      ageLabel: 'Umur',
      agePlaceholder: 'Contoh: 3 tahun',
      weightLabel: 'Berat',
      weightPlaceholder: 'Contoh: 5 kg',
      birthdayLabel: 'Tanggal Lahir',
      photoLabel: 'Foto',
      photoPlaceholder: 'Unggah foto hewan peliharaan Anda',
      notesLabel: 'Catatan',
      notesPlaceholder: 'Kebutuhan khusus, preferensi, atau informasi lainnya',
      back: 'Kembali ke Profil',
      save: 'Simpan Perubahan',
      choosePhoto: 'Pilih Foto',
      activeLabel: 'Status Aktif',
      activeDescription: 'Aktifkan jika hewan peliharaan Anda sedang aktif',
      species: {
        cat: 'Kucing',
        dog: 'Anjing',
        other: 'Lainnya'
      },
      successMsg: 'Profil hewan berhasil diperbarui!',
      errorMsg: 'Terjadi kesalahan saat memperbarui profil hewan. Silakan coba lagi.',
      notFoundMsg: 'Hewan tidak ditemukan',
      loadingMsg: 'Memuat profil hewan...'
    }
  };
  
  const t = translations[language];

  useEffect(() => {
    const fetchPet = async () => {
      if (!id || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const petData = mapDbPetToPet(data);
          setPet(petData);
          
          setFormData({
            name: petData.name,
            species: petData.species,
            breed: petData.breed || '',
            age: petData.age || '',
            weight: petData.weight || '',
            birthday: petData.birthday || '',
            notes: petData.notes || '',
            image_url: petData.image_url || '',
            is_active: petData.is_active
          });
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        toast({
          title: t.notFoundMsg,
          variant: 'destructive'
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [id, user, navigate, toast, t]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('pet-images')
        .upload(filePath, imageFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('pet-images').getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error uploading image',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to update a pet',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.name || !formData.species) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image if exists
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage() || imageUrl;
      }
      
      // Update pet in database
      const { data, error } = await supabase
        .from('pets')
        .update({
          ...formData,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: t.successMsg
      });
      
      // Navigate back to the pet's profile
      navigate(`/pets/${id}`);
    } catch (error) {
      console.error('Error updating pet:', error);
      toast({
        title: t.errorMsg,
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
        <div className="animate-pulse">{t.loadingMsg}</div>
      </div>
    );
  }
  
  if (!pet) {
    return (
      <div className="container px-4 mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t.notFoundMsg}</h2>
        <Button asChild>
          <a href="/dashboard">Back to Dashboard</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-sage/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <a href={`/pets/${id}`} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t.back}
            </a>
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t.pageTitle}</CardTitle>
                <CardDescription>{t.pageDescription}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.nameLabel}</label>
                    <Input 
                      placeholder={t.namePlaceholder} 
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.speciesLabel}</label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                          formData.species === 'cat' 
                            ? 'bg-sage/30 text-charcoal' 
                            : 'bg-white/70 text-muted-foreground hover:bg-sage/10'
                        }`}
                        onClick={() => handleChange('species', 'cat')}
                      >
                        <Cat className="w-4 h-4" />
                        <span>{t.species.cat}</span>
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                          formData.species === 'dog' 
                            ? 'bg-sage/30 text-charcoal' 
                            : 'bg-white/70 text-muted-foreground hover:bg-sage/10'
                        }`}
                        onClick={() => handleChange('species', 'dog')}
                      >
                        <Dog className="w-4 h-4" />
                        <span>{t.species.dog}</span>
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                          formData.species === 'other' 
                            ? 'bg-sage/30 text-charcoal' 
                            : 'bg-white/70 text-muted-foreground hover:bg-sage/10'
                        }`}
                        onClick={() => handleChange('species', 'other')}
                      >
                        <span>{t.species.other}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.breedLabel}</label>
                    <Input 
                      placeholder={t.breedPlaceholder} 
                      value={formData.breed || ''}
                      onChange={(e) => handleChange('breed', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t.ageLabel}</label>
                      <Input 
                        placeholder={t.agePlaceholder} 
                        value={formData.age || ''}
                        onChange={(e) => handleChange('age', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t.weightLabel}</label>
                      <Input 
                        placeholder={t.weightPlaceholder} 
                        value={formData.weight || ''}
                        onChange={(e) => handleChange('weight', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.birthdayLabel}</label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 opacity-50" />
                      <Input 
                        type="date" 
                        value={formData.birthday || ''}
                        onChange={(e) => handleChange('birthday', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.photoLabel}</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {imageFile ? (
                          <img 
                            src={URL.createObjectURL(imageFile)} 
                            alt="Pet preview" 
                            className="h-full w-full object-cover"
                          />
                        ) : formData.image_url ? (
                          <img 
                            src={formData.image_url} 
                            alt="Pet" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <div className="px-4 py-2 bg-sage/20 hover:bg-sage/30 text-charcoal rounded-full transition-colors">
                          {t.choosePhoto}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{t.activeLabel}</p>
                      <p className="text-sm text-muted-foreground">{t.activeDescription}</p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange('is_active', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.notesLabel}</label>
                    <Textarea 
                      placeholder={t.notesPlaceholder} 
                      value={formData.notes || ''}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(`/pets/${id}`)}
                  >
                    {t.back}
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-sage hover:bg-sage/90"
                    disabled={isSubmitting || isUploading || !formData.name || !formData.species}
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

export default EditPet;
