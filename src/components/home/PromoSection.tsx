
import { Link } from 'react-router-dom';

interface PromoSectionProps {
  t: Record<string, string>;
}

const PromoSection = ({ t }: PromoSectionProps) => {
  return (
    <div className="px-4 mb-20">
      <h2 className="text-xl font-bold mb-4">{t.ongoingPromos || 'Ongoing Promos'}</h2>
      
      {/* Main Promo Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-yellow-400 to-rose-600 rounded-xl overflow-hidden h-48">
          <img 
            src="public/lovable-uploads/272e3d26-ab02-4cad-9224-9293a2ab301e.png" 
            alt="Promo" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Products Section */}
      <h2 className="text-xl font-bold mb-4">{t.healthProducts || 'Health Products'}</h2>
      
      {/* Product Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rose-500 rounded-xl h-36 overflow-hidden"></div>
        <div className="bg-rose-500 rounded-xl h-36 overflow-hidden"></div>
      </div>
    </div>
  );
};

export default PromoSection;
