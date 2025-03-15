
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  Heart, 
  Bell, 
  PawPrint,
  Menu, 
  X
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <PawPrint className="w-5 h-5" /> },
    { name: 'Health', path: '/health', icon: <Heart className="w-5 h-5" /> },
    { name: 'Reminders', path: '/reminders', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur',
        scrolled ? 'py-3 shadow-md bg-white/80' : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-display font-bold"
            onClick={() => setIsOpen(false)}
          >
            <PawPrint className="w-8 h-8 text-coral" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral to-sage">FurFriend</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2',
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

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden text-charcoal p-2 rounded-lg hover:bg-muted/30"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
