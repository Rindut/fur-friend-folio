
import { MapPin, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const MobileHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="px-4 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-pink-100">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-pink-200 text-pink-700">
            {user ? user.email.substring(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-medium text-lg">
              {user?.user_metadata?.username || 'Pet Parent'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center text-rose-500">
        <MapPin className="h-5 w-5" />
      </div>
    </div>
  );
};

export default MobileHeader;
