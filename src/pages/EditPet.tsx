
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PawPrint, Calendar, Upload, ArrowLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  age: z.string().optional(),
  weight: z.string().optional(),
  birthday: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PetFormValues = z.infer<typeof petSchema>;

const EditPet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const translations = {
    en: {
      pageTitle: 'Edit Pet Profile',
      pageDescription: 'Update your pet\'s information',
      nameLabel: 'Pet Name',
      namePlaceholder: 'Enter your pet\'s name',
      speciesLabel: 'Species',
      breedLabel: 'Breed',
      breedPlaceholder: 'Enter breed (optional)',
      ageLabel: 'Age',
      agePlaceholder: 'E.g. 3 years',
      weightLabel: 'Weight',
      weightPlaceholder: 'E.g. 25 lbs',
      birthdayLabel: 'Birthday',
      notesLabel: 'Notes',
      notesPlaceholder: 'Add any additional information about your pet',
      imageLabel: 'Pet Photo',
      uploadButton: 'Upload Image',
      changeButton: 'Change Image',
      statusLabel: 'Pet Status',
      statusActive: 'Active',
      statusInactive: 'Inactive',
      cancel: 'Cancel',
      save: 'Save Changes',
      backToPet: 'Back to Pet Profile',
      species: {
        dog: 'Dog',
        cat: 'Cat',
        bird: 'Bird',
        rabbit: 'Rabbit',
        fish: 'Fish',
        other: 'Other'
      },
      success: 'Pet profile updated successfully',
      loading: 'Loading pet information...',
      notFound: 'Pet not found'
    },
    id: {
      pageTitle: 'Edit Profil Hewan',
      pageDescription: 'Perbarui informasi hewan peliharaan Anda',
      nameLabel: 'Nama Hewan',
      namePlaceholder: 'Masukkan nama hewan',
      speciesLabel: 'Jenis',
      breedLabel: 'Ras',
      breedPlaceholder: 'Masukkan ras (opsional)',
      ageLabel: 'Umur',
      agePlaceholder: 'Cth: 3 tahun',
      weightLabel: 'Berat',
      weightPlaceholder: 'Cth: 11 kg',
      birthdayLabel: 'Tanggal Lahir',
      notesLabel: 'Catatan',
      notesPlaceholder: 'Tambahkan informasi lain tentang hewan peliharaan Anda',
      imageLabel: 'Foto Hewan',
      uploadButton: 'Unggah Gambar',
      changeButton: 'Ganti Gambar',
      statusLabel: 'Status Hewan',
      statusActive: 'Aktif',
      statusInactive: 'Tidak Aktif',
      cancel: 'Batal',
      save: 'Simpan Perubahan',
      backToPet: 'Kembali ke Profil Hewan',
      species: {
        dog: 'Anjing',
        cat: 'Kucing',
        bird: 'Burung',
        rabbit: 'Kelinci',
        fish: 'Ikan',
        other: 'Lainnya'
      },
      success: 'Profil hewan berhasil diperbarui',
      loading: 'Memuat informasi hewan...',
      notFound: 'Hewan tidak ditemukan'
    }
  };
  
  const t = translations[language];

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      age: '',
      weight: '',
      birthday: '',
      notes: '',
      imageUrl: '',
      isActive: true
    }
  });
  
  useEffect(() => {
    const fetchPet = async () => {
      if (!user || !id) return;
      
      try {
        const { data: pet, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (pet) {
          form.reset({
            name: pet.name || '',
            species: pet.species || '',
            breed: pet.breed || '',
            age: pet.age || '',
            weight: pet.weight || '',
            birthday: pet.birthday || '',
            notes: pet.notes || '',
            imageUrl: pet.image_url || '',
            isActive: pet.is_active ?? true
          });
          
          setImageUrl(pet.image_url);
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pet information',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [id, user, form, toast]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user?.id}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // This is a mockup, as we don't have actual file upload to Supabase implemented
      // In a real app, you would upload to Supabase storage
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll use a URL constructor to create a local object URL
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      form.setValue('imageUrl', objectUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your pet photo has been uploaded.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  const onSubmit = async (data: PetFormValues) => {
    if (!user || !id) {
      toast({
        title: 'Error',
        description: 'Missing required information',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Update pet data in Supabase
      const { data: pet, error } = await supabase
        .from('pets')
        .update({
          name: data.name,
          species: data.species,
          breed: data.breed || null,
          age: data.age || null,
          weight: data.weight || null,
          birthday: data.birthday || null,
          notes: data.notes || null,
          image_url: data.imageUrl || null,
          is_active: data.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: t.success,
        duration: 3000
      });
      
      // Navigate back to the pet profile page
      navigate(`/pets/${id}`);
    } catch (error) {
      console.error('Error updating pet profile:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the pet profile.',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse">{t.loading}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <Button variant="ghost" className="mb-6" onClick={() => navigate(`/pets/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToPet}
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t.pageTitle}</CardTitle>
                <CardDescription>{t.pageDescription}</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="mb-8 flex flex-col items-center justify-center">
                        <div className="relative mb-4">
                          {imageUrl ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                              <img 
                                src={imageUrl} 
                                alt="Pet preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <PawPrint size={40} />
                            </div>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.imageLabel}</FormLabel>
                              <FormControl>
                                <div>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="pet-image-upload"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('pet-image-upload')?.click()}
                                    disabled={uploading}
                                    className="flex gap-2"
                                  >
                                    <Upload className="w-4 h-4" />
                                    {imageUrl ? t.changeButton : t.uploadButton}
                                  </Button>
                                  <input 
                                    {...field}
                                    type="hidden"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.nameLabel}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.namePlaceholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="species"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.speciesLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t.speciesLabel} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dog">{t.species.dog}</SelectItem>
                                <SelectItem value="cat">{t.species.cat}</SelectItem>
                                <SelectItem value="bird">{t.species.bird}</SelectItem>
                                <SelectItem value="rabbit">{t.species.rabbit}</SelectItem>
                                <SelectItem value="fish">{t.species.fish}</SelectItem>
                                <SelectItem value="other">{t.species.other}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.breedLabel}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.breedPlaceholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.ageLabel}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t.agePlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.weightLabel}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t.weightPlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.birthdayLabel}</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="date"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.notesLabel}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t.notesPlaceholder}
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.statusLabel}</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value === 'active')}
                              value={field.value ? 'active' : 'inactive'}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">{t.statusActive}</SelectItem>
                                <SelectItem value="inactive">{t.statusInactive}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(`/pets/${id}`)}
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
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPet;
