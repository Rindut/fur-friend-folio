
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ShoppingBag, 
  Home as HomeIcon, 
  Shield, 
  Activity,
  Sparkles, 
  Heart, 
  MoreHorizontal 
} from 'lucide-react';

interface ServiceIconsProps {
  t: Record<string, string>;
}

const ServiceIcons = ({ t }: ServiceIconsProps) => {
  const services = [
    {
      icon: <Stethoscope className="h-6 w-6 text-rose-500" />,
      name: t.chatWithDoctor || 'Chat with Doctor',
      path: '/health-records',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-rose-500" />,
      name: t.healthStore || 'Health Store',
      path: '/pet-family',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <HomeIcon className="h-6 w-6 text-rose-500" />,
      name: t.homecare || 'Homecare',
      path: '/dashboard',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      name: t.myInsurance || 'My Insurance',
      path: '/profile',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <Activity className="h-6 w-6 text-emerald-600" />,
      name: 'Halofit',
      path: '/dashboard',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-pink-500" />,
      name: 'Haloskin',
      path: '/reminders',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      name: t.sexualHealth || 'Sexual Health',
      path: '/health-records',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <MoreHorizontal className="h-6 w-6 text-slate-700" />,
      name: t.seeAll || 'See All',
      path: '/dashboard',
      bgColor: 'bg-blue-100'
    },
  ];

  return (
    <div className="px-4 mb-8">
      <div className="grid grid-cols-4 gap-y-6">
        {services.map((service, index) => (
          <Link to={service.path} key={index} className="flex flex-col items-center">
            <div className={`${service.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-2`}>
              {service.icon}
            </div>
            <span className="text-xs text-center">{service.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceIcons;
