
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useForm } from 'react-hook-form';
import { ProfileForm, ProfileFormValues } from '@/components/owner-profile/ProfileForm';
import { useProfileData } from '@/components/owner-profile/useProfileData';
import { getProfileTranslations } from '@/components/owner-profile/translations';

const OwnerProfile = () => {
  const { language } = useLanguage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      username: '',
      avatarUrl: '',
    }
  });
  
  const { loading } = useProfileData(form, setAvatarUrl);
  const translations = getProfileTranslations(language);
  
  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse">{translations.loading}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            <ProfileForm translations={translations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
