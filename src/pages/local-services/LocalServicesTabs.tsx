
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/context/LanguageContext';
import ServiceSearch from '@/components/local-services/ServiceSearch';
import ExternalServiceSearch from '@/components/local-services/ExternalServiceSearch';
import ServicesList from '@/components/local-services/ServicesList';
import EmptyExternalServices from '@/components/local-services/EmptyExternalServices';
import { useServices } from './hooks/useServices';
import { useExternalServices } from './hooks/useExternalServices';

const LocalServicesTabs = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('internal');
  
  const {
    services,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleSearch,
    fetchServices
  } = useServices();
  
  const {
    externalServices,
    externalLoading,
    selectedCity,
    setSelectedCity,
    enabledPlatforms,
    togglePlatform,
    handleFetchExternal,
    handleImportService
  } = useExternalServices(fetchServices);
  
  const translations = {
    en: {
      localDatabase: 'Our Database',
      externalPlatforms: 'External Platforms',
    },
    id: {
      localDatabase: 'Database Kami',
      externalPlatforms: 'Platform Eksternal',
    }
  };
  
  const t = translations[language];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleExternalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchExternal(searchQuery, selectedCategory);
  };

  return (
    <Tabs defaultValue="internal" value={activeTab} onValueChange={handleTabChange} className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="internal">{t.localDatabase}</TabsTrigger>
        <TabsTrigger value="external">{t.externalPlatforms}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="internal">
        {/* Internal Services Search */}
        <ServiceSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          onSearch={handleSearch}
        />
        
        {/* Internal Services List */}
        <ServicesList 
          services={services} 
          loading={loading} 
        />
      </TabsContent>
      
      <TabsContent value="external">
        {/* External Services Search */}
        <ExternalServiceSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          enabledPlatforms={enabledPlatforms}
          togglePlatform={togglePlatform}
          categories={categories}
          onSearch={handleExternalSearch}
          handleFetchExternal={() => handleFetchExternal(searchQuery, selectedCategory)}
          externalLoading={externalLoading}
        />
        
        {/* External Services List */}
        {externalServices.length > 0 || externalLoading ? (
          <ServicesList 
            services={externalServices} 
            loading={externalLoading} 
            isExternal={true}
            onImport={handleImportService}
          />
        ) : (
          <EmptyExternalServices />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LocalServicesTabs;
