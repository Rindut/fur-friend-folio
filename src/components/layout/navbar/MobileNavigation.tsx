
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NavLink } from './types';

interface MobileNavigationProps {
  navLinks: NavLink[];
  translations: {
    signIn: string;
    signOut: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
}

const MobileNavigation = ({ 
  navLinks, 
  translations, 
  isOpen, 
  onClose, 
  onSignOut 
}: MobileNavigationProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const t = translations;

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-white pt-20 md:hidden animate-fade-in">
      <nav className="container mx-auto px-4 py-8 flex flex-col gap-4">
        {navLinks.map((link) => (
          <div key={link.path} className="flex flex-col">
            <Link
              to={link.path}
              onClick={onClose}
              className={cn(
                'px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3',
                location.pathname === link.path
                  ? 'bg-coral/20 text-coral font-medium'
                  : 'hover:bg-muted/30 text-charcoal/80 hover:text-charcoal'
              )}
            >
              {link.icon}
              <span className="text-lg">{link.name}</span>
            </Link>
          </div>
        ))}
        
        {user ? (
          <button
            onClick={handleSignOut}
            className="px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-lg">{t.signOut}</span>
          </button>
        ) : (
          <Link
            to="/auth"
            onClick={onClose}
            className="px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-blue-600 hover:bg-blue-50"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-lg">{t.signIn}</span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileNavigation;
