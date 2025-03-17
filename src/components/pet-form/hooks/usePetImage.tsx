
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

export const usePetImage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    en: { 
      imageUploaded: 'Image uploaded',
      imageUploadedDesc: 'Your pet photo has been uploaded.',
      uploadFailed: 'Upload failed',
      uploadFailedDesc: 'There was an error uploading your image.'
    },
    id: {
      imageUploaded: 'Gambar diunggah',
      imageUploadedDesc: 'Foto hewan peliharaan Anda telah diunggah.',
      uploadFailed: 'Unggahan gagal',
      uploadFailedDesc: 'Terjadi kesalahan saat mengunggah gambar Anda.'
    }
  };

  const t = translations[language];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, userId?: string) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      
      toast({
        title: t.imageUploaded,
        description: t.imageUploadedDesc,
      });
      
      return objectUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t.uploadFailed,
        description: t.uploadFailedDesc,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    imageUrl,
    setImageUrl,
    uploading,
    setUploading,
    handleImageUpload
  };
};
