import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  Heart, 
  PawPrint,
  Menu, 
  X,
  Globe,
  LogIn,
  LogOut,
  User,
  Map,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translations = {
    en: {
      home: 'Home',
      dashboard: 'Dashboard',
      health: 'Health',
      services: 'Local Services',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      profile: 'Profile',
      loggedInAs: 'Logged in as'
    },
    id: {
      home: 'Beranda',
      dashboard: 'Dasbor',
      health: 'Kesehatan',
      services: 'Layanan Lokal',
      signIn: 'Masuk',
      signOut: 'Keluar',
      profile: 'Profil',
      loggedInAs: 'Masuk sebagai'
    }
  };

  const t = translations[language];

  // Basic links for all users
  let navLinks = [
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

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur',
        scrolled ? 'py-2 shadow-md bg-white/80' : 'py-3 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-1 text-lg font-display font-bold"
            onClick={() => setIsOpen(false)}
          >
            <PawPrint className="w-6 h-6 text-coral" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral to-sage">ANABULKU</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 text-sm',
                    location.pathname === link.path
                      ? 'bg-coral/20 text-coral font-medium'
                      : 'hover:bg-muted/30 text-charcoal/80 hover:text-charcoal'
                  )}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
            
            <button 
              onClick={toggleLanguage}
              className="p-1.5 rounded-full hover:bg-muted/30 text-charcoal/80"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="sr-only">
                {language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
              </span>
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-muted">
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
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.signOut}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="flex items-center gap-1.5 py-1.5 px-3 h-auto text-sm">
                  <LogIn className="w-3.5 h-3.5" />
                  {t.signIn}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-muted/30 text-charcoal/80"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-sage/20 text-sage">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t.loggedInAs} {user.user_metadata?.username || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.signOut}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="p-2">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            
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
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 md:hidden animate-fade-in">
          <nav className="container mx-auto px-4 py-8 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-blue-600 hover:bg-blue-50"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-lg">{t.signIn}</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
