
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Heart, 
  PawPrint,
  Menu, 
  X,
  Map
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Logo from './navbar/Logo';
import DesktopNavigation from './navbar/DesktopNavigation';
import UserMenu from './navbar/UserMenu';
import MobileNavigation from './navbar/MobileNavigation';
import LanguageToggle from './navbar/LanguageToggle';
import { translations } from './navbar/translations';
import { NavLink } from './navbar/types';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[language];

  // Basic links for all users
  let navLinks: NavLink[] = [
    { name: t.home, path: '/', icon: <Home className="w-4 h-4" /> },
  ];
  
  // Add authenticated user links
  if (user) {
    navLinks = [
      ...navLinks,
      { name: t.dashboard, path: '/dashboard', icon: <PawPrint className="w-4 h-4" /> },
      { name: t.health, path: '/health', icon: <Heart className="w-4 h-4" /> },
    ];
  }
  
  // Add services link for all users
  navLinks.push({ name: t.services, path: '/services', icon: <Map className="w-4 h-4" /> });

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur',
        scrolled ? 'py-2 shadow-md bg-white/80' : 'py-3 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Logo onClick={() => setIsOpen(false)} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <DesktopNavigation translations={t} />
            
            <LanguageToggle />
            <UserMenu translations={t} />
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle mobile={true} />
            
            <UserMenu 
              translations={t} 
              onSignOut={() => setIsOpen(false)} 
              mobile={true} 
            />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal p-2 rounded-lg hover:bg-muted/30"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        navLinks={navLinks}
        translations={t}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSignOut={signOut}
      />
    </header>
  );
};

export default Navbar;
