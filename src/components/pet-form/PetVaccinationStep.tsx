
import React from 'react';
import { usePetForm } from './PetFormContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';

export const PetVaccinationStep: React.FC = () => {
  const { form, addCustomVaccination } = usePetForm();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      vaccinationsLabel: 'Vaccinations',
      vaccinationDateLabel: 'Vaccination Date',
      clinicLabel: 'Veterinary Clinic',
      clinicPlaceholder: 'Enter clinic name',
      addVaccinationButton: 'Add Another Vaccination',
      otherVaccinationLabel: 'Other Vaccination',
      otherVaccinationPlaceholder: 'Specify vaccination name',
      noStandardVaccinations: 'No standard vaccinations for this pet type',
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
      vaccinationsLabel: 'Vaksinasi',
      vaccinationDateLabel: 'Tanggal Vaksinasi',
      clinicLabel: 'Klinik Hewan',
      clinicPlaceholder: 'Masukkan nama klinik',
      addVaccinationButton: 'Tambah Vaksinasi Lain',
      otherVaccinationLabel: 'Vaksinasi Lainnya',
      otherVaccinationPlaceholder: 'Tentukan nama vaksinasi',
      noStandardVaccinations: 'Tidak ada vaksinasi standar untuk jenis hewan ini',
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
  const species = form.watch('species');
  const vaccinations = form.watch('vaccinations') || [];
  
  const renderVaccinationOptions = () => {
    if (!species) return null;
    
    if (species === 'fish') {
      return (
        <div className="mb-6 p-4 bg-muted/30 rounded-md">
          <p className="text-base text-muted-foreground">{t.noStandardVaccinations}</p>
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
                        <FormLabel className="text-base font-medium">{t.otherVaccinationLabel}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t.otherVaccinationPlaceholder} 
                            {...field} 
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                ) : (
                  <label 
                    htmlFor={`vax-${index}`} 
                    className="text-base font-medium cursor-pointer"
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
                    <FormLabel className="text-base font-medium">{t.vaccinationDateLabel}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-base font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t.vaccinationDateLabel}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                name={`vaccinations.${index}.clinic`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{t.clinicLabel}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t.clinicPlaceholder} 
                        {...field} 
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
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
          className="mt-4 text-sm"
        >
          {t.addVaccinationButton}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4">{t.vaccinationsLabel}</h3>
      {renderVaccinationOptions()}
    </div>
  );
};
