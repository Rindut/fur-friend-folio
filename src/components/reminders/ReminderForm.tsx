
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
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  petId: z.string().min(1, "Pet is required"),
  repeatFrequency: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface PetOption {
  id: string;
  name: string;
}

interface ReminderFormProps {
  petId?: string;
  onSuccess?: () => void;
}

const ReminderForm = ({ petId, onSuccess }: ReminderFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [pets, setPets] = useState<PetOption[]>([]);
  const [loading, setLoading] = useState(false);
  
  const translations = {
    en: {
      pageTitle: 'Add Reminder',
      pageDescription: 'Create a new care reminder for your pet',
      titleLabel: 'Reminder Title',
      titlePlaceholder: 'E.g. Vaccination appointment',
      petLabel: 'Pet',
      petPlaceholder: 'Select pet',
      dateLabel: 'Date',
      timeLabel: 'Time (optional)',
      repeatLabel: 'Repeat',
      repeatPlaceholder: 'Select frequency',
      descriptionLabel: 'Description (optional)',
      descriptionPlaceholder: 'Add any additional notes about this reminder',
      cancel: 'Cancel',
      save: 'Save Reminder',
      back: 'Back',
      success: 'Reminder created successfully',
      loadingPets: 'Loading pets...',
      noPets: 'No pets found. Please add a pet first.',
      frequencies: {
        never: 'Never',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly'
      },
      error: 'Error',
      errorDesc: 'Failed to create reminder'
    },
    id: {
      pageTitle: 'Tambah Pengingat',
      pageDescription: 'Buat pengingat perawatan baru untuk hewan peliharaan Anda',
      titleLabel: 'Judul Pengingat',
      titlePlaceholder: 'Cth: Janji vaksinasi',
      petLabel: 'Hewan',
      petPlaceholder: 'Pilih hewan',
      dateLabel: 'Tanggal',
      timeLabel: 'Waktu (opsional)',
      repeatLabel: 'Pengulangan',
      repeatPlaceholder: 'Pilih frekuensi',
      descriptionLabel: 'Deskripsi (opsional)',
      descriptionPlaceholder: 'Tambahkan catatan tambahan tentang pengingat ini',
      cancel: 'Batal',
      save: 'Simpan Pengingat',
      back: 'Kembali',
      success: 'Pengingat berhasil dibuat',
      loadingPets: 'Memuat hewan...',
      noPets: 'Tidak ada hewan ditemukan. Silakan tambahkan hewan terlebih dahulu.',
      frequencies: {
        never: 'Tidak Pernah',
        daily: 'Harian',
        weekly: 'Mingguan',
        monthly: 'Bulanan',
        yearly: 'Tahunan'
      },
      error: 'Kesalahan',
      errorDesc: 'Gagal membuat pengingat'
    }
  };
  
  const t = translations[language];

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      petId: petId || '',
      repeatFrequency: 'never',
    }
  });
  
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, name')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setPets(data);
          
          if (data.length > 0 && !petId) {
            form.setValue('petId', data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
        toast({
          title: t.error,
          description: 'Failed to load pets',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user, form, petId, toast, t.error]);
  
  const onSubmit = async (data: ReminderFormValues) => {
    if (!user) {
      toast({
        title: t.error,
        description: 'You must be logged in to create a reminder',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create reminder in Supabase
      const { error } = await supabase
        .from('reminders')
        .insert({
          title: data.title,
          description: data.description || null,
          date: data.date,
          time: data.time || null,
          pet_id: data.petId,
          user_id: user.id,
          repeat_frequency: data.repeatFrequency === 'never' ? null : data.repeatFrequency,
        });
        
      if (error) throw error;
      
      toast({
        title: t.success,
        duration: 3000
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate back to reminders page
        navigate('/reminders');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast({
        title: t.error,
        description: t.errorDesc,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pageTitle}</CardTitle>
        <CardDescription>{t.pageDescription}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.titleLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.titlePlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="petId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.petLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.petPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pets.length > 0 ? (
                        pets.map(pet => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {loading ? t.loadingPets : t.noPets}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.dateLabel}</FormLabel>
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.timeLabel}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          {...field}
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
              name="repeatFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.repeatLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'never'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.repeatPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="never">{t.frequencies.never}</SelectItem>
                      <SelectItem value="daily">{t.frequencies.daily}</SelectItem>
                      <SelectItem value="weekly">{t.frequencies.weekly}</SelectItem>
                      <SelectItem value="monthly">{t.frequencies.monthly}</SelectItem>
                      <SelectItem value="yearly">{t.frequencies.yearly}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.descriptionPlaceholder}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> {t.back}
            </Button>
            <Button 
              type="submit"
              className="bg-sage hover:bg-sage/90"
              disabled={loading}
            >
              {t.save}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ReminderForm;
