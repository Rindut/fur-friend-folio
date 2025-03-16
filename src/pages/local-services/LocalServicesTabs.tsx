
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/context/LanguageContext';
import ServiceSearch from '@/components/local-services/ServiceSearch';
import ServicesList from '@/components/local-services/ServicesList';
import { useServices } from './hooks/useServices';

const LocalServicesTabs = () => {
  const { language } = useLanguage();
  
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
  
  const translations = {
    en: {
      localDatabase: 'Our Database',
    },
    id: {
      localDatabase: 'Database Kami',
    }
  };
  
  const t = translations[language];

  return (
    <div className="mb-8">
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
    </div>
  );
};

export default LocalServicesTabs;
