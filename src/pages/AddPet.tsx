
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PawPrint, Calendar, Upload } from 'lucide-react';
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
});

type PetFormValues = z.infer<typeof petSchema>;

const AddPet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const translations = {
    en: {
      pageTitle: 'Add New Pet',
      pageDescription: 'Create a profile for your pet',
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
      cancel: 'Cancel',
      save: 'Save Pet Profile',
      species: {
        dog: 'Dog',
        cat: 'Cat',
        bird: 'Bird',
        rabbit: 'Rabbit',
        fish: 'Fish',
        other: 'Other'
      },
      success: 'Pet profile created successfully'
    },
    id: {
      pageTitle: 'Tambah Hewan Peliharaan',
      pageDescription: 'Buat profil untuk hewan peliharaan Anda',
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
      cancel: 'Batal',
      save: 'Simpan Profil',
      species: {
        dog: 'Anjing',
        cat: 'Kucing',
        bird: 'Burung',
        rabbit: 'Kelinci',
        fish: 'Ikan',
        other: 'Lainnya'
      },
      success: 'Profil hewan berhasil dibuat'
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
    }
  });
  
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
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to add a pet profile',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Insert pet data into Supabase
      const { data: pet, error } = await supabase
        .from('pets')
        .insert([
          {
            name: data.name,
            species: data.species,
            breed: data.breed || null,
            age: data.age || null,
            weight: data.weight || null,
            birthday: data.birthday || null,
            notes: data.notes || null,
            image_url: data.imageUrl || null,
            user_id: user.id
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: t.success,
        duration: 3000
      });
      
      // Navigate to the pet profile page
      if (pet) {
        navigate(`/pets/${pet.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating pet profile:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the pet profile.',
        variant: 'destructive',
      });
    }
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
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

export default AddPet;
