
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, PawPrint, Heart, Map, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface DesktopNavigationProps {
  translations: {
    home: string;
    dashboard: string;
    petFamily: string;
    petProgress: string;
    health: string;
    petCareHistory: string;
    upcomingPetCare: string;
    services: string;
  };
}

const DesktopNavigation = ({ translations }: DesktopNavigationProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const t = translations;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link 
            to="/" 
            className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === '/' ? 'bg-coral/20 text-coral font-medium' : ''
            )}
          >
            <Home className="w-4 h-4 mr-2" />
            {t.home}
          </Link>
        </NavigationMenuItem>
        
        {user && (
          <>
            <NavigationMenuItem>
              <Link 
                to="/dashboard" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === '/dashboard' ? 'bg-coral/20 text-coral font-medium' : ''
                )}
              >
                <PawPrint className="w-4 h-4 mr-2" />
                {t.dashboard}
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link 
                to="/pet-family" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === '/pet-family' ? 'bg-coral/20 text-coral font-medium' : ''
                )}
              >
                <Users className="w-4 h-4 mr-2" />
                {t.petFamily}
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link 
                to="/health" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === '/health' ? 'bg-coral/20 text-coral font-medium' : ''
                )}
              >
                <Heart className="w-4 h-4 mr-2" />
                {t.health}
              </Link>
            </NavigationMenuItem>
          </>
        )}
        
        <NavigationMenuItem>
          <Link 
            to="/services" 
            className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === '/services' ? 'bg-coral/20 text-coral font-medium' : ''
            )}
          >
            <Map className="w-4 h-4 mr-2" />
            {t.services}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
