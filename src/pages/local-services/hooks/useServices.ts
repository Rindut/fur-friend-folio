
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Service, ServiceCategory, mapDbCategoryToServiceCategory, mapDbServiceToService } from '@/types/petServices';

export const useServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service categories',
        variant: 'destructive',
      });
    } else {
      setCategories(data.map(mapDbCategoryToServiceCategory));
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    
    let query = supabase
      .from('services')
      .select(`
        *,
        service_categories(name)
      `);
    
    if (selectedCategory && selectedCategory !== "all") {
      query = query.eq('category_id', selectedCategory);
    }
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pet services',
        variant: 'destructive',
      });
    } else {
      // Process data to get category name and convert to our Service type
      const processedServices = data.map(service => {
        return mapDbServiceToService({
          ...service,
          category_name: service.service_categories?.name
        });
      });
      
      setServices(processedServices);
    }
    
    setLoading(false);
  };

  // Initial fetch of categories and services
  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  // Fetch services when category or search query changes
  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  return {
    services,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleSearch,
    fetchServices
  };
};
