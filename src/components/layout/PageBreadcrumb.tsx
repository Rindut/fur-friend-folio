
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLanguage } from '@/context/LanguageContext';

interface BreadcrumbMap {
  [key: string]: {
    en: string;
    id: string;
  };
}

const PageBreadcrumb = () => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const pathMap: BreadcrumbMap = {
    'dashboard': { en: 'Dashboard', id: 'Dasbor' },
    'pet-family': { en: 'Pet Family', id: 'Keluarga Hewan' },
    'health': { en: 'Health Records', id: 'Catatan Kesehatan' },
    'reminders': { en: 'Reminders', id: 'Pengingat' },
    'pets': { en: 'Pet Profile', id: 'Profil Hewan' },
    'analytics': { en: 'Analytics', id: 'Analitik' },
  };
  
  // If we're on home page, don't show breadcrumbs
  if (location.pathname === '/') {
    return null;
  }
  
  // Split the path and create breadcrumb items
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <div className="container px-4 py-3 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">{language === 'en' ? 'Home' : 'Beranda'}</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
            // Handle pet ID in the URL
            if (name.match(/^[0-9a-fA-F-]+$/) && pathnames[index - 1] === 'pets') {
              return (
                <BreadcrumbItem key={index}>
                  {isLast ? (
                    <BreadcrumbPage>
                      {language === 'en' ? 'Pet Details' : 'Detail Hewan'}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink asChild>
                        <Link to={routeTo}>
                          {language === 'en' ? 'Pet Details' : 'Detail Hewan'}
                        </Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              );
            }
            
            return (
              <BreadcrumbItem key={index}>
                {isLast ? (
                  <BreadcrumbPage>
                    {pathMap[name] ? pathMap[name][language] : name}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>
                        {pathMap[name] ? pathMap[name][language] : name}
                      </Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
