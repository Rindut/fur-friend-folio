
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, PawPrint, Heart, Users, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

interface DesktopNavigationProps {
  translations: {
    home: string;
    dashboard: string;
    petFamily: string;
    petManagement: string;
    addPet: string;
    health: string;
    petProgress: string;
    healthRecords: string;
    petCareHistory: string;
    upcomingPetCare: string;
    services: string;
    profile: string;
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
                <Home className="w-4 h-4 mr-2" />
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
              <NavigationMenuTrigger className={cn(
                location.pathname.includes('/pets') ? 'bg-coral/20 text-coral font-medium' : ''
              )}>
                <PawPrint className="w-4 h-4 mr-2" />
                {t.petManagement}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[200px] gap-3 p-4">
                  <Link 
                    to="/pets/new" 
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                  >
                    <PawPrint className="w-4 h-4" />
                    {t.addPet}
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link 
                to="/health" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === '/health' || location.pathname.includes('/health/') ? 'bg-coral/20 text-coral font-medium' : ''
                )}
              >
                <Heart className="w-4 h-4 mr-2" />
                {t.health}
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link 
                to="/profile" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === '/profile' ? 'bg-coral/20 text-coral font-medium' : ''
                )}
              >
                <User className="w-4 h-4 mr-2" />
                {t.profile}
              </Link>
            </NavigationMenuItem>
          </>
        )}
        
        {/* Services link is hidden now
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
        */}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
