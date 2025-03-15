
import { CareTask } from './reminders';

export interface Reminder {
  id: string;
  pet_id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  repeat_frequency?: string;
  created_at: string;
  updated_at: string;
}

export type ReminderFormData = Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const mapDbReminderToReminder = (dbReminder: any): Reminder => {
  return {
    id: dbReminder.id,
    pet_id: dbReminder.pet_id,
    user_id: dbReminder.user_id,
    title: dbReminder.title,
    description: dbReminder.description,
    date: dbReminder.date,
    time: dbReminder.time,
    repeat_frequency: dbReminder.repeat_frequency,
    created_at: dbReminder.created_at,
    updated_at: dbReminder.updated_at
  };
};

export const mapReminderToCareTask = (reminder: Reminder, petName: string): CareTask => {
  // Determine task type based on title or other properties
  let type: 'medication' | 'vaccination' | 'grooming' | 'feeding' | 'walk' | 'appointment' | 'other' = 'other';
  
  const lowerTitle = reminder.title.toLowerCase();
  if (lowerTitle.includes('medication') || lowerTitle.includes('med') || lowerTitle.includes('pill')) {
    type = 'medication';
  } else if (lowerTitle.includes('vaccination') || lowerTitle.includes('vaccine') || lowerTitle.includes('shot')) {
    type = 'vaccination';
  } else if (lowerTitle.includes('groom') || lowerTitle.includes('bath') || lowerTitle.includes('haircut')) {
    type = 'grooming';
  } else if (lowerTitle.includes('food') || lowerTitle.includes('feed') || lowerTitle.includes('meal')) {
    type = 'feeding';
  } else if (lowerTitle.includes('walk') || lowerTitle.includes('exercise') || lowerTitle.includes('play')) {
    type = 'walk';
  } else if (lowerTitle.includes('vet') || lowerTitle.includes('doctor') || lowerTitle.includes('appointment')) {
    type = 'appointment';
  }
  
  return {
    id: reminder.id,
    type,
    title: reminder.title,
    petName,
    petId: reminder.pet_id,
    dueDate: reminder.date,
    time: reminder.time,
    completed: false,
    important: reminder.description?.toLowerCase().includes('important') || false
  };
};
