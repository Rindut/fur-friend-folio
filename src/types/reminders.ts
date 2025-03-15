
import { Database } from '@/integrations/supabase/types';

// Define custom types for reminders that work with the current database structure
export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  time?: string;
  petId: string;
  petName: string;
  completed: boolean;
  important?: boolean;
  type: 'medication' | 'vaccination' | 'grooming' | 'feeding' | 'walk' | 'appointment' | 'other';
  userId: string;
  createdAt: string;
}

// This matches the CareTask interface in CareTaskCard but ensures type safety
export type CareTask = {
  id: string;
  type: 'medication' | 'vaccination' | 'grooming' | 'feeding' | 'walk' | 'appointment' | 'other';
  title: string;
  petName: string;
  petId: string;
  dueDate: string;
  time?: string;
  completed: boolean;
  important?: boolean;
};

// Helper function to convert database records to our application types
export const mapDbReminderToCareTask = (dbReminder: any): CareTask => {
  return {
    id: dbReminder.id,
    type: dbReminder.type || 'other',
    title: dbReminder.title,
    petName: dbReminder.pet_name || '',
    petId: dbReminder.pet_id,
    dueDate: dbReminder.due_date,
    time: dbReminder.time,
    completed: dbReminder.completed,
    important: dbReminder.important
  };
};
