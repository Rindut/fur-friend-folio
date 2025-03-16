
import { useState, useEffect } from 'react';
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
import { PawPrint, Calendar, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  otherSpecies: z.string().optional(),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female']),
  color: z.string().optional(),
  birthday: z.date().optional(),
  isEstimatedAge: z.boolean().optional(),
  ageYears: z.coerce.number().min(0).optional(),
  ageMonths: z.coerce.number().min(0).max(11).optional(),
  weight: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  vaccinations: z.array(z.object({
    type: z.string(),
    date: z.date().optional(),
    clinic: z.string().optional(),
    isCustom: z.boolean().optional(),
    customName: z.string().optional(),
  })).optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

const AddPet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(3);
  
  const translations = {
    en: {
      pageTitle: 'Add New Pet',
      pageDescription: 'Create a profile for your pet',
      step1: 'Pet Information',
      step2: 'Vaccination Information',
      step3: 'Submit & Save',
      nameLabel: 'Pet Name',
      namePlaceholder: 'Enter your pet\'s name',
      speciesLabel: 'Species',
      otherSpeciesLabel: 'Other Pet Type',
      otherSpeciesPlaceholder: 'Specify your pet type',
      breedLabel: 'Breed',
      breedPlaceholder: 'Enter breed (optional)',
      genderLabel: 'Gender',
      male: 'Male',
      female: 'Female',
      colorLabel: 'Fur / Body Color',
      colorPlaceholder: 'Enter color',
      birthdayLabel: 'Date of Birth',
      estimatedAgeLabel: 'Estimated Age',
      ageLabel: 'Age',
      ageYearsLabel: 'Years',
      ageMonthsLabel: 'Months',
      weightLabel: 'Weight (kg)',
      weightPlaceholder: 'Enter weight in kilograms',
      notesLabel: 'Additional Notes',
      notesPlaceholder: 'Add any special notes or health concerns',
      imageLabel: 'Pet Photo',
      uploadButton: 'Upload Image',
      changeButton: 'Change Image',
      prevButton: 'Previous',
      nextButton: 'Next',
      cancelButton: 'Cancel',
      saveButton: 'Save Pet Profile',
      vaccinationsLabel: 'Vaccinations',
      vaccinationDateLabel: 'Vaccination Date',
      clinicLabel: 'Veterinary Clinic',
      clinicPlaceholder: 'Enter clinic name',
      addVaccinationButton: 'Add Another Vaccination',
      otherVaccinationLabel: 'Other Vaccination',
      otherVaccinationPlaceholder: 'Specify vaccination name',
      noStandardVaccinations: 'No standard vaccinations for this pet type',
      success: 'Pet profile created successfully',
      species: {
        cat: 'Cat',
        dog: 'Dog',
        rabbit: 'Rabbit',
        hamster: 'Hamster',
        fish: 'Fish',
        bird: 'Bird',
        other: 'Other'
      },
      vaccinations: {
        cat: {
          tricat: 'Tricat',
          tetracat: 'Tetracat',
          rabies: 'Rabies',
          fvrfe: 'FVR-Fe',
          other: 'Other'
        },
        dog: {
          dhpp: 'DHPP',
          rabies: 'Rabies',
          leptospirosis: 'Leptospirosis',
          bordetella: 'Bordetella',
          other: 'Other'
        },
        rabbit: {
          myxomatosis: 'Myxomatosis',
          vhd: 'VHD',
          other: 'Other'
        },
        hamster: {
          other: 'Other'
        },
        fish: {
          other: 'Other'
        },
        bird: {
          newcastle: 'Newcastle Disease',
          pacheco: 'Pacheco\'s Disease',
          other: 'Other'
        },
        other: {
          other: 'Other'
        }
      }
    },
    id: {
      pageTitle: 'Tambah Hewan Peliharaan',
      pageDescription: 'Buat profil untuk hewan peliharaan Anda',
      step1: 'Informasi Hewan',
      step2: 'Informasi Vaksinasi',
      step3: 'Simpan & Selesai',
      nameLabel: 'Nama Hewan',
      namePlaceholder: 'Masukkan nama hewan',
      speciesLabel: 'Jenis',
      otherSpeciesLabel: 'Jenis Hewan Lainnya',
      otherSpeciesPlaceholder: 'Tentukan jenis hewan Anda',
      breedLabel: 'Ras',
      breedPlaceholder: 'Masukkan ras (opsional)',
      genderLabel: 'Jenis Kelamin',
      male: 'Jantan',
      female: 'Betina',
      colorLabel: 'Warna Bulu / Tubuh',
      colorPlaceholder: 'Masukkan warna',
      birthdayLabel: 'Tanggal Lahir',
      estimatedAgeLabel: 'Perkiraan Umur',
      ageLabel: 'Umur',
      ageYearsLabel: 'Tahun',
      ageMonthsLabel: 'Bulan',
      weightLabel: 'Berat (kg)',
      weightPlaceholder: 'Masukkan berat dalam kilogram',
      notesLabel: 'Catatan Tambahan',
      notesPlaceholder: 'Tambahkan catatan khusus atau masalah kesehatan',
      imageLabel: 'Foto Hewan',
      uploadButton: 'Unggah Gambar',
      changeButton: 'Ganti Gambar',
      prevButton: 'Sebelumnya',
      nextButton: 'Selanjutnya',
      cancelButton: 'Batal',
      saveButton: 'Simpan Profil',
      vaccinationsLabel: 'Vaksinasi',
      vaccinationDateLabel: 'Tanggal Vaksinasi',
      clinicLabel: 'Klinik Hewan',
      clinicPlaceholder: 'Masukkan nama klinik',
      addVaccinationButton: 'Tambah Vaksinasi Lain',
      otherVaccinationLabel: 'Vaksinasi Lainnya',
      otherVaccinationPlaceholder: 'Tentukan nama vaksinasi',
      noStandardVaccinations: 'Tidak ada vaksinasi standar untuk jenis hewan ini',
      success: 'Profil hewan berhasil dibuat',
      species: {
        cat: 'Kucing',
        dog: 'Anjing',
        rabbit: 'Kelinci',
        hamster: 'Hamster',
        fish: 'Ikan',
        bird: 'Burung',
        other: 'Lainnya'
      },
      vaccinations: {
        cat: {
          tricat: 'Tricat',
          tetracat: 'Tetracat',
          rabies: 'Rabies',
          fvrfe: 'FVR-Fe',
          other: 'Lainnya'
        },
        dog: {
          dhpp: 'DHPP',
          rabies: 'Rabies',
          leptospirosis: 'Leptospirosis',
          bordetella: 'Bordetella',
          other: 'Lainnya'
        },
        rabbit: {
          myxomatosis: 'Myxomatosis',
          vhd: 'VHD',
          other: 'Lainnya'
        },
        hamster: {
          other: 'Lainnya'
        },
        fish: {
          other: 'Lainnya'
        },
        bird: {
          newcastle: 'Penyakit Newcastle',
          pacheco: 'Penyakit Pacheco',
          other: 'Lainnya'
        },
        other: {
          other: 'Lainnya'
        }
      }
    }
  };
  
  const t = translations[language];

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      otherSpecies: '',
      breed: '',
      gender: 'male',
      color: '',
      ageYears: 0,
      ageMonths: 0,
      weight: undefined,
      notes: '',
      imageUrl: '',
      isEstimatedAge: false,
      vaccinations: [],
    }
  });
  
  const watchSpecies = form.watch('species');
  const watchIsEstimatedAge = form.watch('isEstimatedAge');
  
  // Set up available vaccinations based on species
  useEffect(() => {
    if (!watchSpecies) return;
    
    let vaccinations: any[] = [];
    
    if (watchSpecies === 'cat') {
      vaccinations = [
        { type: 'tricat', isCustom: false },
        { type: 'tetracat', isCustom: false },
        { type: 'rabies', isCustom: false },
        { type: 'fvrfe', isCustom: false }
      ];
    } else if (watchSpecies === 'dog') {
      vaccinations = [
        { type: 'dhpp', isCustom: false },
        { type: 'rabies', isCustom: false },
        { type: 'leptospirosis', isCustom: false },
        { type: 'bordetella', isCustom: false }
      ];
    } else if (watchSpecies === 'rabbit') {
      vaccinations = [
        { type: 'myxomatosis', isCustom: false },
        { type: 'vhd', isCustom: false }
      ];
    } else if (watchSpecies === 'bird') {
      vaccinations = [
        { type: 'newcastle', isCustom: false },
        { type: 'pacheco', isCustom: false }
      ];
    }
    
    // Add an "other" option for all species except fish
    if (watchSpecies !== 'fish') {
      form.setValue('vaccinations', vaccinations);
    } else {
      form.setValue('vaccinations', []);
    }
  }, [watchSpecies, form]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user?.id}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
  
  // Add a custom vaccination
  const addCustomVaccination = () => {
    const currentVaccinations = form.getValues('vaccinations') || [];
    form.setValue('vaccinations', [
      ...currentVaccinations,
      { type: 'other', isCustom: true, customName: '' }
    ]);
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
      // Format vaccination data
      const formattedVaccinations = data.vaccinations?.map(vax => {
        return {
          type: vax.isCustom ? vax.customName : vax.type,
          date: vax.date ? format(vax.date, 'yyyy-MM-dd') : null,
          clinic: vax.clinic || null
        };
      });
      
      // Insert pet data into Supabase
      const { data: pet, error } = await supabase
        .from('pets')
        .insert([
          {
            name: data.name,
            species: data.species === 'other' ? data.otherSpecies : data.species,
            breed: data.breed || null,
            gender: data.gender,
            color: data.color || null,
            birthday: data.birthday ? format(data.birthday, 'yyyy-MM-dd') : null,
            notes: data.notes || null,
            image_url: data.imageUrl || null,
            user_id: user.id,
            age_years: data.isEstimatedAge ? data.ageYears || 0 : null,
            age_months: data.isEstimatedAge ? data.ageMonths || 0 : null,
            weight_kg: data.weight || null,
            vaccinations: formattedVaccinations || null
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
  
  // Navigation between steps
  const nextStep = () => {
    setStep(current => Math.min(current + 1, totalSteps));
  };
  
  const prevStep = () => {
    setStep(current => Math.max(current - 1, 1));
  };
  
  // Renders the vaccinations list based on pet species
  const renderVaccinationOptions = () => {
    const species = form.getValues('species');
    if (!species) return null;
    
    const vaccinations = form.getValues('vaccinations') || [];
    
    if (species === 'fish') {
      return (
        <div className="mb-6 p-4 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">{t.noStandardVaccinations}</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {vaccinations.map((vaccination, index) => (
          <div key={index} className="p-4 border rounded-md">
            <div className="flex items-start mb-4">
              <Checkbox 
                id={`vax-${index}`} 
                checked={true}
                onCheckedChange={(checked) => {
                  const newVaccinations = [...vaccinations];
                  if (!checked) {
                    newVaccinations.splice(index, 1);
                  }
                  form.setValue('vaccinations', newVaccinations);
                }}
              />
              <div className="ml-2">
                {vaccination.isCustom ? (
                  <FormField
                    control={form.control}
                    name={`vaccinations.${index}.customName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.otherVaccinationLabel}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t.otherVaccinationPlaceholder} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <label 
                    htmlFor={`vax-${index}`} 
                    className="font-medium cursor-pointer"
                  >
                    {t.vaccinations[species][vaccination.type]}
                  </label>
                )}
              </div>
            </div>
            
            <div className="space-y-4 pl-6">
              <FormField
                control={form.control}
                name={`vaccinations.${index}.date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t.vaccinationDateLabel}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t.vaccinationDateLabel}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`vaccinations.${index}.clinic`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.clinicLabel}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t.clinicPlaceholder} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={addCustomVaccination}
          className="mt-4"
        >
          {t.addVaccinationButton}
        </Button>
      </div>
    );
  };
  
  // Render the form based on the current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
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
                      <SelectItem value="cat">{t.species.cat}</SelectItem>
                      <SelectItem value="dog">{t.species.dog}</SelectItem>
                      <SelectItem value="rabbit">{t.species.rabbit}</SelectItem>
                      <SelectItem value="hamster">{t.species.hamster}</SelectItem>
                      <SelectItem value="fish">{t.species.fish}</SelectItem>
                      <SelectItem value="bird">{t.species.bird}</SelectItem>
                      <SelectItem value="other">{t.species.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchSpecies === 'other' && (
              <FormField
                control={form.control}
                name="otherSpecies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.otherSpeciesLabel}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.otherSpeciesPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t.genderLabel}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {t.male}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {t.female}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.colorLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.colorPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t.birthdayLabel}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                            disabled={watchIsEstimatedAge}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t.birthdayLabel}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isEstimatedAge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue('birthday', undefined);
                          } else {
                            form.setValue('ageYears', 0);
                            form.setValue('ageMonths', 0);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        {t.estimatedAgeLabel}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {watchIsEstimatedAge && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ageYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.ageLabel} ({t.ageYearsLabel})</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ageMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.ageLabel} ({t.ageMonthsLabel})</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.weightLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder={t.weightPlaceholder}
                      {...field}
                    />
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
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t.vaccinationsLabel}</h3>
            {renderVaccinationOptions()}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <PawPrint className="mx-auto mb-4 h-12 w-12 text-lavender" />
              <h3 className="text-xl font-semibold mb-2">{t.pageTitle}</h3>
              <p className="text-muted-foreground">
                {t.pageDescription}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t.pageTitle}</CardTitle>
                    <CardDescription>{t.pageDescription}</CardDescription>
                  </div>
                  <div className="text-sm font-medium">
                    {t[`step${step}`]} ({step}/{totalSteps})
                  </div>
                </div>
                
                {/* Steps indicator */}
                <div className="w-full mt-4">
                  <div className="flex justify-between mb-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            i + 1 === step 
                              ? 'bg-lavender text-white' 
                              : i + 1 < step 
                                ? 'bg-lavender/20 text-lavender' 
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-lavender transition-all duration-300 ease-in-out"
                      style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    {renderStepContent()}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div>
                      {step > 1 ? (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={prevStep}
                          className="flex items-center"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          {t.prevButton}
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => navigate('/dashboard')}
                        >
                          {t.cancelButton}
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      {step < totalSteps ? (
                        <Button 
                          type="button"
                          onClick={nextStep}
                          className="bg-lavender hover:bg-lavender/90 flex items-center"
                        >
                          {t.nextButton}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit"
                          className="bg-lavender hover:bg-lavender/90"
                        >
                          {t.saveButton}
                        </Button>
                      )}
                    </div>
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
