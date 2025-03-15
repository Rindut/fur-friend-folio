
/**
 * Map our category to Google Places API type
 */
export function mapCategoryToGoogleType(category: string): string {
  if (!category || category === "all") return "";
  
  const categoryMap: {[key: string]: string} = {
    'veterinary_clinics': 'veterinary_care',
    'pet_shops': 'pet_store',
    'grooming_services': 'pet_store',
    'pet_hotels': 'lodging',
    'pet_cafes': 'cafe',
    'pet_friendly_restaurants': 'restaurant',
    'pet_parks': 'park',
    'pet_training': 'point_of_interest'
  };
  
  return categoryMap[category] || '';
}

/**
 * Get keyword for our category to enhance search
 */
export function getCategoryKeyword(category: string): string {
  if (!category || category === "all") return "pet";
  
  const keywordMap: {[key: string]: string} = {
    'veterinary_clinics': 'veterinary clinic pet',
    'pet_shops': 'pet shop store',
    'grooming_services': 'pet grooming salon',
    'pet_hotels': 'pet hotel boarding',
    'pet_cafes': 'pet cafe',
    'pet_friendly_restaurants': 'pet friendly restaurant',
    'pet_parks': 'dog park',
    'pet_training': 'pet training school'
  };
  
  return keywordMap[category] || 'pet';
}

/**
 * Detect category from place types
 */
export function detectCategoryFromPlaceTypes(types: string[]): string {
  if (types.includes('veterinary_care')) return 'veterinary_clinics';
  if (types.includes('pet_store')) return 'pet_shops';
  if (types.includes('lodging') && types.includes('point_of_interest')) return 'pet_hotels';
  if ((types.includes('cafe') || types.includes('restaurant')) && types.includes('point_of_interest')) return 'pet_cafes';
  if (types.includes('park')) return 'pet_parks';
  if (types.includes('restaurant')) return 'pet_friendly_restaurants';
  
  return 'pet_shops'; // Default to pet shops
}

/**
 * Detect category from search query
 */
export function detectCategoryFromQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('vet') || lowerQuery.includes('clinic') || lowerQuery.includes('dokter hewan')) 
    return 'veterinary_clinics';
  if (lowerQuery.includes('groom') || lowerQuery.includes('salon')) 
    return 'grooming_services';
  if (lowerQuery.includes('hotel') || lowerQuery.includes('boarding') || lowerQuery.includes('penginapan')) 
    return 'pet_hotels';
  if (lowerQuery.includes('cafe') || lowerQuery.includes('kafe')) 
    return 'pet_cafes';
  if (lowerQuery.includes('park') || lowerQuery.includes('taman')) 
    return 'pet_parks';
  if (lowerQuery.includes('train') || lowerQuery.includes('school') || lowerQuery.includes('latih')) 
    return 'pet_training';
  if (lowerQuery.includes('restaurant') || lowerQuery.includes('restoran')) 
    return 'pet_friendly_restaurants';
  
  return 'pet_shops'; // Default to pet shops
}
