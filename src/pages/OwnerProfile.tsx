
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { User, Upload } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const OwnerProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const translations = {
    en: {
      pageTitle: 'Owner Profile',
      pageDescription: 'Manage your personal information',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      avatarLabel: 'Profile Photo',
      uploadButton: 'Upload Image',
      changeButton: 'Change Image',
      cancel: 'Cancel',
      save: 'Save Changes',
      success: 'Profile updated successfully',
      loading: 'Loading profile information...'
    },
    id: {
      pageTitle: 'Profil Pemilik',
      pageDescription: 'Kelola informasi pribadi Anda',
      usernameLabel: 'Nama Pengguna',
      usernamePlaceholder: 'Masukkan nama pengguna Anda',
      avatarLabel: 'Foto Profil',
      uploadButton: 'Unggah Gambar',
      changeButton: 'Ganti Gambar',
      cancel: 'Batal',
      save: 'Simpan Perubahan',
      success: 'Profil berhasil diperbarui',
      loading: 'Memuat informasi profil...'
    }
  };
  
  const t = translations[language];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      avatarUrl: '',
    }
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        
        if (profile) {
          form.reset({
            username: profile.username || '',
            avatarUrl: profile.avatar_url || '',
          });
          
          setAvatarUrl(profile.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile information',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, form, toast]);
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user?.id}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // This is a mockup, as we don't have actual file upload to Supabase implemented
      // In a real app, you would upload to Supabase storage
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll use a URL constructor to create a local object URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      form.setValue('avatarUrl', objectUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile photo has been uploaded.',
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
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to update your profile',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Update profile data in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: data.username,
          avatar_url: data.avatarUrl || null,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: t.success,
        duration: 3000
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating your profile.',
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
                          {avatarUrl ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                              <img 
                                src={avatarUrl} 
                                alt="Avatar preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <User size={40} />
                            </div>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.avatarLabel}</FormLabel>
                              <FormControl>
                                <div>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="avatar-upload"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    disabled={uploading}
                                    className="flex gap-2"
                                  >
                                    <Upload className="w-4 h-4" />
                                    {avatarUrl ? t.changeButton : t.uploadButton}
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
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.usernameLabel}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.usernamePlaceholder}
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

export default OwnerProfile;
