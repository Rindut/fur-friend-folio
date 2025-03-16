
import { cn } from '@/lib/utils';
import { Plus, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AddPetButtonProps {
  className?: string;
  variant?: 'default' | 'outline';
}

const AddPetButton = ({ className, variant = 'default' }: AddPetButtonProps) => {
  return (
    <Link
      to="/pets/new"
      className={cn(
        'pet-card flex flex-col items-center justify-center gap-3 p-5 min-h-[200px] pet-card-hover group h-full',
        variant === 'default' 
          ? 'bg-gradient-to-br from-coral/10 to-coral/20 hover:from-coral/20 hover:to-coral/30 border-dashed border-2 border-coral/30' 
          : 'glass-morphism border-dashed border-2 border-slate-200/70',
        className
      )}
    >
      <div className={cn(
        'p-3 rounded-full transition-all duration-300 group-hover:scale-110',
        variant === 'default' ? 'bg-coral/20 text-coral' : 'bg-muted/30 text-muted-foreground'
      )}>
        <Plus className="w-6 h-6" />
      </div>
      <span className={cn(
        'font-medium text-center',
        variant === 'default' ? 'text-coral' : 'text-muted-foreground'
      )}>
        Add a Pet
      </span>
      <span className="text-xs text-muted-foreground text-center">Create a new pet profile</span>
    </Link>
  );
};

export default AddPetButton;
