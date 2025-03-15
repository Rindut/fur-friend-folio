
import { cn } from '@/lib/utils';
import { PawPrint } from 'lucide-react';

interface PetAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline';
  className?: string;
}

const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const PetAvatar = ({ 
  src, 
  name, 
  size = 'md', 
  status,
  className 
}: PetAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <div className={cn(
        'overflow-hidden rounded-full bg-muted flex items-center justify-center',
        'border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105',
        sizeClasses[size]
      )}>
        {src ? (
          <img 
            src={src} 
            alt={`${name}'s avatar`} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-sage to-lavender">
            <span className="font-semibold text-white">{getInitials(name)}</span>
          </div>
        )}
      </div>
      
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 block rounded-full border-2 border-white',
          status === 'online' ? 'bg-green-500' : 'bg-gray-300',
          size === 'sm' ? 'w-2 h-2' : 'w-3 h-3',
          size === 'lg' ? 'w-4 h-4' : '',
          size === 'xl' ? 'w-5 h-5' : ''
        )}/>
      )}
    </div>
  );
};

export default PetAvatar;
