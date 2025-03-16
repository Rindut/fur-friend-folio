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
import { PetFormProvider, usePetForm } from '@/components/pet-form/PetFormContext';
import { PetBasicInfoStep } from '@/components/pet-form/PetBasicInfoStep';
import { PetVaccinationStep } from '@/components/pet-form/PetVaccinationStep';
import { PetSubmitStep } from '@/components/pet-form/PetSubmitStep';
import { PetFormSteps } from '@/components/pet-form/PetFormSteps';

const AddPet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
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

  // Navigation between steps
  const nextStep = () => {
    setStep(current => Math.min(current + 1, totalSteps));
  };
  
  const prevStep = () => {
    setStep(current => Math.max(current - 1, 1));
  };
  
  // Render the form based on the current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PetBasicInfoStep />;
      case 2:
        return <PetVaccinationStep />;
      case 3:
        return <PetSubmitStep />;
      default:
        return null;
    }
  };
  
  return (
    <PetFormProvider>
      <div className="min-h-screen pb-20">
        <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-semibold">{t.pageTitle}</CardTitle>
                      <CardDescription className="text-base mt-1">{t.pageDescription}</CardDescription>
                    </div>
                    <div className="text-sm font-medium">
                      {t[`step${step}`]} ({step}/{totalSteps})
                    </div>
                  </div>
                  
                  <PetFormSteps step={step} totalSteps={totalSteps} />
                </CardHeader>
                
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
                        className="flex items-center text-sm"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t.prevButton}
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="text-sm"
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
                        className="bg-lavender hover:bg-lavender/90 flex items-center text-sm"
                      >
                        {t.nextButton}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button 
                        form="pet-form"
                        type="submit"
                        className="bg-lavender hover:bg-lavender/90 text-sm"
                      >
                        {t.saveButton}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PetFormProvider>
  );
};

export default AddPet;
