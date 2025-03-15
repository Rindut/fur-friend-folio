
export interface OwnerProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  updated_at?: string;
}

export type OwnerFormData = Omit<OwnerProfile, 'id' | 'updated_at'>;

export const mapDbProfileToOwner = (dbProfile: any): OwnerProfile => {
  return {
    id: dbProfile.id,
    username: dbProfile.username,
    avatar_url: dbProfile.avatar_url,
    updated_at: dbProfile.updated_at
  };
};
