
import { Link } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from './utils';

interface UserMenuProps {
  translations: {
    signIn: string;
    signOut: string;
    loggedInAs: string;
  };
  onSignOut?: () => void;
  mobile?: boolean;
}

const UserMenu = ({ translations, onSignOut, mobile = false }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const t = translations;

  const handleSignOut = async () => {
    await signOut();
    if (onSignOut) {
      onSignOut();
    }
  };

  if (!user) {
    if (mobile) {
      return (
        <Link to="/auth" className="p-2">
          <LogIn className="w-5 h-5" />
        </Link>
      );
    }
    
    return (
      <Link to="/auth">
        <Button variant="default" className="flex items-center gap-1.5 py-1.5 px-3 h-auto text-sm">
          <LogIn className="w-3.5 h-3.5" />
          {t.signIn}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className={`h-8 w-8 ${!mobile ? 'border border-muted' : ''}`}>
            <AvatarFallback className="bg-sage/20 text-sage text-xs">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.username || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
