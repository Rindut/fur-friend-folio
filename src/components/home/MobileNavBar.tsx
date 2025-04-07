
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, Mail, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const MobileNavBar = () => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const navItems = [
    {
      icon: <Home className={`h-6 w-6 ${location.pathname === '/' ? 'text-rose-500' : 'text-gray-500'}`} />,
      label: language === 'en' ? 'Home' : 'Beranda',
      path: '/'
    },
    {
      icon: <ClipboardList className={`h-6 w-6 ${location.pathname === '/history' ? 'text-rose-500' : 'text-gray-500'}`} />,
      label: language === 'en' ? 'History' : 'Riwayat',
      path: '/dashboard'
    },
    {
      icon: <User className={`h-6 w-6 ${location.pathname === '/profile' ? 'text-rose-500' : 'text-gray-500'}`} />,
      label: language === 'en' ? 'Profile' : 'Profil',
      path: '/profile'
    },
    {
      icon: <Mail className={`h-6 w-6 ${location.pathname === '/inbox' ? 'text-rose-500' : 'text-gray-500'}`} />,
      label: language === 'en' ? 'Inbox' : 'Kotak Masuk',
      path: '/pet-family'
    },
    {
      icon: <Settings className={`h-6 w-6 ${location.pathname === '/settings' ? 'text-rose-500' : 'text-gray-500'}`} />,
      label: language === 'en' ? 'Settings' : 'Pengaturan',
      path: '/auth'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            className="flex flex-col items-center py-2 px-3"
          >
            {item.icon}
            <span className={`text-xs mt-1 ${location.pathname === item.path ? 'text-rose-500' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavBar;
