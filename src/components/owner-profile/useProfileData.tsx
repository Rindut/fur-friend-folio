
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormValues } from './ProfileForm';
import { UseFormReturn } from 'react-hook-form';

export const useProfileData = (form: UseFormReturn<ProfileFormValues>, setAvatarUrl: (url: string | null) => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
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
          // Check if fields exist before accessing them
          form.reset({
            username: profile.username || '',
            fullName: '',  // Initialize with empty string as it's not in the DB yet
            phoneNumber: '', // Initialize with empty string as it's not in the DB yet
            province: '',    // Initialize with empty string as it's not in the DB yet
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
  }, [user, form, toast, setAvatarUrl]);
  
  return {
    loading
  };
};
