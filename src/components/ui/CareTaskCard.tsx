
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Check,
  X,
  AlertCircle,
  Pill,
  Droplets,
  Dog,
  Scissors,
  Bath,
  Apple,
} from 'lucide-react';

export type TaskType = 
  | 'medication'
  | 'vaccination'
  | 'grooming'
  | 'bath'
  | 'walk'
  | 'feeding'
  | 'vet'
  | 'other';

export interface CareTask {
  id: string;
  type: TaskType;
  title: string;
  petName: string;
  petId: string;
  dueDate: string;
  time?: string;
  completed: boolean;
  important?: boolean;
}

interface CareTaskCardProps {
  task: CareTask;
  onComplete?: (id: string) => void;
  className?: string;
}

const getTaskIcon = (type: TaskType) => {
  switch (type) {
    case 'medication':
      return <Pill className="w-4 h-4" />;
    case 'vaccination':
      return <Droplets className="w-4 h-4" />;
    case 'grooming':
      return <Scissors className="w-4 h-4" />;
    case 'bath':
      return <Bath className="w-4 h-4" />;
    case 'walk':
      return <Dog className="w-4 h-4" />;
    case 'feeding':
      return <Apple className="w-4 h-4" />;
    case 'vet':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const CareTaskCard = ({ task, onComplete, className }: CareTaskCardProps) => {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={cn(
        'glass-morphism rounded-xl p-4 transition-all duration-200',
        task.completed ? 'bg-gray-100/70 opacity-75' : 'hover:shadow-md',
        isOverdue ? 'border-l-4 border-l-destructive' : '',
        task.important ? 'border-l-4 border-l-coral' : '',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'p-1.5 rounded-full',
                task.completed
                  ? 'bg-sage/20 text-sage'
                  : task.type === 'medication'
                  ? 'bg-coral/20 text-coral'
                  : task.type === 'vaccination'
                  ? 'bg-lavender/20 text-lavender'
                  : task.type === 'vet'
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-muted/50 text-muted-foreground'
              )}
            >
              {getTaskIcon(task.type)}
            </span>
            <div className="flex flex-col">
              <span
                className={cn(
                  'text-sm font-medium',
                  task.completed ? 'line-through text-muted-foreground' : ''
                )}
              >
                {task.title}
              </span>
              <span className="text-xs text-muted-foreground">
                For {task.petName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground ml-8">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </div>
            {task.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.time}</span>
              </div>
            )}
          </div>
        </div>

        {onComplete && (
          <button
            onClick={() => onComplete(task.id)}
            className={cn(
              'p-1.5 rounded-full transition-colors duration-200',
              task.completed
                ? 'bg-sage/20 text-sage hover:bg-sage/30'
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
            )}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <Check className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-current" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CareTaskCard;
