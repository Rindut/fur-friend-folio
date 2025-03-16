
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, PawPrint, Heart, Map } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
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
              <NavigationMenuTrigger className={location.pathname === '/dashboard' ? 'bg-coral/20 text-coral font-medium' : ''}>
                <PawPrint className="w-4 h-4 mr-2" />
                {t.dashboard}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[220px] gap-3 p-4">
                  <li className="row-span-1">
                    <Link
                      to="/dashboard#pet-family"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted hover:text-coral"
                    >
                      <PawPrint className="w-4 h-4" />
                      <span>{t.petFamily}</span>
                    </Link>
                  </li>
                  <li className="row-span-1">
                    <Link
                      to="/dashboard#pet-progress"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted hover:text-coral"
                    >
                      <PawPrint className="w-4 h-4" />
                      <span>{t.petProgress}</span>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className={location.pathname === '/health' ? 'bg-coral/20 text-coral font-medium' : ''}>
                <Heart className="w-4 h-4 mr-2" />
                {t.health}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[220px] gap-3 p-4">
                  <li className="row-span-1">
                    <Link
                      to="/health#pet-care-history"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted hover:text-coral"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{t.petCareHistory}</span>
                    </Link>
                  </li>
                  <li className="row-span-1">
                    <Link
                      to="/health#upcoming-pet-care"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted hover:text-coral"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{t.upcomingPetCare}</span>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
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
