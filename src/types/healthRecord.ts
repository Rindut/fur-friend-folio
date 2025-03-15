
export interface HealthRecord {
  id: string;
  pet_id: string;
  user_id: string;
  type: 'vaccination' | 'medication' | 'weight' | 'visit';
  title: string;
  date: string;
  details?: string;
  created_at: string;
}

export type HealthRecordFormData = Omit<HealthRecord, 'id' | 'user_id' | 'created_at'>;

export const mapDbHealthRecordToHealthRecord = (dbRecord: any): HealthRecord => {
  return {
    id: dbRecord.id,
    pet_id: dbRecord.pet_id,
    user_id: dbRecord.user_id,
    type: dbRecord.type,
    title: dbRecord.title,
    date: dbRecord.date,
    details: dbRecord.details,
    created_at: dbRecord.created_at
  };
};
