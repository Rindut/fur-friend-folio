
export interface NavLink {
  name: string;
  path: string;
  icon: JSX.Element;
}

// Create a simple type for translations to ensure consistency
export interface NavbarTranslations {
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
  signIn: string;
  signOut: string;
  loggedInAs: string;
  profile: string;
}
