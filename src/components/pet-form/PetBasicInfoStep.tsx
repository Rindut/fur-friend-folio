import React from 'react';
import { usePetForm } from './PetFormContext';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Upload, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

export const PetBasicInfoStep: React.FC = () => {
  const { form, imageUrl, handleImageUpload, uploading } = usePetForm();
  const { language } = useLanguage();
  
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
  const watchSpecies = form.watch('species');
  
  return (
    <div className="space-y-6">
      {/* Pet Basic Information Section */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.nameLabel}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t.namePlaceholder} 
                  className="text-base" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.speciesLabel}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder={t.speciesLabel} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cat" className="text-base">{t.species.cat}</SelectItem>
                  <SelectItem value="dog" className="text-base">{t.species.dog}</SelectItem>
                  <SelectItem value="rabbit" className="text-base">{t.species.rabbit}</SelectItem>
                  <SelectItem value="hamster" className="text-base">{t.species.hamster}</SelectItem>
                  <SelectItem value="fish" className="text-base">{t.species.fish}</SelectItem>
                  <SelectItem value="bird" className="text-base">{t.species.bird}</SelectItem>
                  <SelectItem value="other" className="text-base">{t.species.other}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        {watchSpecies === 'other' && (
          <FormField
            control={form.control}
            name="otherSpecies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">{t.otherSpeciesLabel}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t.otherSpeciesPlaceholder} 
                    className="text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.breedLabel}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t.breedPlaceholder} 
                  className="text-base" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.genderLabel}</FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange} 
                  defaultValue={field.value} 
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="text-base" />
                    <FormLabel htmlFor="male" className="text-base font-normal">{t.male}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="text-base" />
                    <FormLabel htmlFor="female" className="text-base font-normal">{t.female}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fur_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.colorLabel}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t.colorPlaceholder} 
                  className="text-base" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base font-medium">{t.birthdayLabel}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3.5 text-left font-normal text-base"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t.birthdayLabel}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isEstimatedAge"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">{t.estimatedAgeLabel}</FormLabel>
                  <FormDescription className="text-sm">
                    {t.estimatedAgeLabel}
                  </FormDescription>
                </div>
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        {form.getValues('isEstimatedAge') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ageYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">{t.ageLabel} ({t.ageYearsLabel})</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ageMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">{t.ageLabel} ({t.ageMonthsLabel})</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.weightLabel}</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder={t.weightPlaceholder} 
                  className="text-base" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.notesLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t.notesPlaceholder}
                  className="text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        
        {/* Image Upload Section */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">{t.imageLabel}</FormLabel>
              <div className="mt-2">
                {imageUrl ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt="Pet preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('pet-image-upload')?.click()}
                      className="text-sm"
                    >
                      <Upload className="mr-2 h-4 w-4" /> {t.changeButton}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById('pet-image-upload')?.click()}
                    className="w-full py-8 border-dashed text-base"
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : t.uploadButton}
                  </Button>
                )}
                <input
                  id="pet-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p className="text-sm text-muted-foreground" {...props} />
  );
};
