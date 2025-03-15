
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { OwnerProfile as OwnerProfileType, OwnerFormData, mapDbProfileToOwner } from '@/types/owner';

const OwnerProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<OwnerProfileType | null>(null);
  const [formData, setFormData] = useState<OwnerFormData>({
    username: '',
    avatar_url: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const translations = {
    en: {
      pageTitle: 'Owner Profile',
      pageDescription: 'Manage your personal profile information',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      avatarLabel: 'Profile Photo',
      choosePhoto: 'Choose Photo',
      back: 'Back to Dashboard',
      save: 'Save Changes',
      successMsg: 'Profile updated successfully!',
      errorMsg: 'Error updating profile. Please try again.',
      loading: 'Loading profile...'
    },
    id: {
      pageTitle: 'Profil Pemilik',
      pageDescription: 'Kelola informasi profil pribadi Anda',
      usernameLabel: 'Nama Pengguna',
      usernamePlaceholder: 'Masukkan nama pengguna Anda',
      avatarLabel: 'Foto Profil',
      choosePhoto: 'Pilih Foto',
      back: 'Kembali ke Dashboard',
      save: 'Simpan Perubahan',
      successMsg: 'Profil berhasil diperbarui!',
      errorMsg: 'Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.',
      loading: 'Memuat profil...'
    }
  };
  
  const t = translations[language];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is fine if the profile doesn't exist yet
          throw error;
        }
        
        if (data) {
          const profileData = mapDbProfileToOwner(data);
          setProfile(profileData);
          
          setFormData({
            username: profileData.username || '',
            avatar_url: profileData.avatar_url || ''
          });
        } else {
          // Initialize with empty profile
          setFormData({
            username: user.email?.split('@')[0] || '',
            avatar_url: ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error loading profile',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    setIsUploading(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-avatar.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(filePath, avatarFile, {
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('pet-images').getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error uploading avatar',
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
    
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to update your profile',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload avatar if exists
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar() || avatarUrl;
      }
      
      const updatedProfile = {
        id: user.id,
        username: formData.username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      };
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert(updatedProfile)
        .select();
        
      if (error) throw error;
      
      // Update local state
      setProfile({
        ...profile,
        ...updatedProfile
      });
      
      toast({
        title: t.successMsg
      });
    } catch (error) {
      console.error('Error updating profile:', error);
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
        <div className="animate-pulse">{t.loading}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-blue-100/50 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <a href="/dashboard" className="flex items-center">
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
                    <label className="text-sm font-medium">{t.usernameLabel}</label>
                    <Input 
                      placeholder={t.usernamePlaceholder} 
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.avatarLabel}</label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        {avatarFile ? (
                          <AvatarImage src={URL.createObjectURL(avatarFile)} />
                        ) : formData.avatar_url ? (
                          <AvatarImage src={formData.avatar_url} />
                        ) : null}
                        <AvatarFallback className="text-2xl bg-blue-100">
                          {formData.username?.charAt(0).toUpperCase() || <User />}
                        </AvatarFallback>
                      </Avatar>
                      <label className="cursor-pointer">
                        <div className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-charcoal rounded-full transition-colors">
                          {t.choosePhoto}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    {t.back}
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={isSubmitting || isUploading}
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

export default OwnerProfile;
