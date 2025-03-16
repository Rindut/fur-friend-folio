
export const getInitials = (email?: string): string => {
  return email ? email.substring(0, 2).toUpperCase() : 'U';
};
