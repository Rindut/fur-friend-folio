import React from 'react';
import { usePetForm } from './PetFormContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PawPrint, Calendar as CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';

export const PetBasicInfoStep: React.FC = () => {
  const { form, imageUrl, uploading, handleImageUpload } = usePetForm();
  const { language } = useLanguage();
  
  const translations = {
    en: {
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
      species: {
        cat: 'Cat',
        dog: 'Dog',
        rabbit: 'Rabbit',
        hamster: 'Hamster',
        fish: 'Fish',
        bird: 'Bird',
        other: 'Other'
      },
    },
    id: {
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
      species: {
        cat: 'Kucing',
        dog: 'Anjing',
        rabbit: 'Kelinci',
        hamster: 'Hamster',
        fish: 'Ikan',
        bird: 'Burung',
        other: 'Lainnya'
      }
    }
  };
  
  const t = translations[language];
  const watchSpecies = form.watch('species');
  const watchIsEstimatedAge = form.watch('isEstimatedAge');
  
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
              <FormLabel className="text-base font-medium">{t.imageLabel}</FormLabel>
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
                    className="flex gap-2 text-sm"
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
            <FormLabel className="text-base font-medium">{t.nameLabel}</FormLabel>
            <FormControl>
              <Input
                placeholder={t.namePlaceholder}
                {...field}
                className="text-base"
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  {...field}
                  className="text-base"
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
                {...field}
                className="text-base"
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
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">{t.genderLabel}</FormLabel>
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
                {...field}
                className="text-base"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
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
                      className={`w-full justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                      disabled={watchIsEstimatedAge}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t.birthdayLabel}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
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
                  <FormLabel className="text-base font-medium">{t.ageLabel} ({t.ageYearsLabel})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      className="text-base"
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
                      min="0"
                      max="11"
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
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
            <FormLabel className="text-base font-medium">{t.weightLabel}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder={t.weightPlaceholder}
                {...field}
                className="text-base"
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
                rows={4}
                {...field}
                className="text-base"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
};
