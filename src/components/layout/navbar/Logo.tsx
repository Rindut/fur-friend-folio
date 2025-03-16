
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
}

const Logo = ({ onClick }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-1 text-lg font-display font-bold"
      onClick={onClick}
    >
      <PawPrint className="w-6 h-6 text-coral" />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral to-sage">ANABULKU</span>
    </Link>
  );
};

export default Logo;
