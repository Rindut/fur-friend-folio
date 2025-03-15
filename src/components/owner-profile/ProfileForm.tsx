
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Upload, User } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AvatarUpload } from './AvatarUpload';

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  avatarUrl: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  translations: {
    pageTitle: string;
    pageDescription: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    avatarLabel: string;
    uploadButton: string;
    changeButton: string;
    cancel: string;
    save: string;
    success: string;
  };
}

export const ProfileForm = ({ translations: t }: ProfileFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      avatarUrl: '',
    }
  });
  
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pageTitle}</CardTitle>
        <CardDescription>{t.pageDescription}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AvatarUpload 
                avatarUrl={avatarUrl}
                uploading={uploading} 
                onUpload={handleAvatarUpload}
                form={form}
                labels={{
                  avatarLabel: t.avatarLabel,
                  uploadButton: t.uploadButton,
                  changeButton: t.changeButton
                }}
              />

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
  );
};
