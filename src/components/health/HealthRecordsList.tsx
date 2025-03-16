
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface HealthRecord {
  id: string;
  type: 'vaccination' | 'medication' | 'weight' | 'visit';
  title: string;
  date: string;
  details?: string;
  petId: string;
}

interface HealthRecordsListProps {
  records: HealthRecord[];
  getRecordIcon: (type: HealthRecord['type']) => JSX.Element;
  getRecordTypeColor: (type: HealthRecord['type']) => string;
  detailsText: string;
  noRecordsText: string;
}

const HealthRecordsList = ({ 
  records, 
  getRecordIcon, 
  getRecordTypeColor,
  detailsText,
  noRecordsText
}: HealthRecordsListProps) => {
  if (records.length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <p className="text-muted-foreground">{noRecordsText}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {records.map(record => (
        <div 
          key={record.id}
          className="glass-morphism rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start">
            <div className={`p-2 rounded-full mr-4 ${getRecordTypeColor(record.type)}`}>
              {getRecordIcon(record.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{record.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{record.date}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  {detailsText}
                </Button>
              </div>
              
              {record.details && (
                <p className="text-sm text-muted-foreground mt-3">
                  {record.details}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthRecordsList;
