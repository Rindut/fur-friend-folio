
import { User, Upload } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './ProfileForm';

interface AvatarUploadProps {
  avatarUrl: string | null;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  form: UseFormReturn<ProfileFormValues>;
  labels: {
    avatarLabel: string;
    uploadButton: string;
    changeButton: string;
  };
}

export const AvatarUpload = ({ 
  avatarUrl, 
  uploading, 
  onUpload, 
  form,
  labels 
}: AvatarUploadProps) => {
  return (
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
            <FormLabel>{labels.avatarLabel}</FormLabel>
            <FormControl>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={onUpload}
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
                  {avatarUrl ? labels.changeButton : labels.uploadButton}
                </Button>
                <input 
                  {...field}
                  type="hidden"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
