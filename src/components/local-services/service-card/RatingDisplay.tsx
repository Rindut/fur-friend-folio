
import { Star, StarHalf } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RatingDisplayProps {
  rating?: number;
  reviewCount?: number;
}

export const RatingDisplay = ({ rating, reviewCount }: RatingDisplayProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      reviews: 'Reviews',
      noRating: 'No ratings yet',
    },
    id: {
      reviews: 'Ulasan',
      noRating: 'Belum ada penilaian',
    }
  };
  
  const t = translations[language];

  if (!rating) return <span className="text-sm text-gray-500">{t.noRating}</span>;
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm font-medium">
        {rating.toFixed(1)}
      </span>
      {reviewCount && (
        <span className="ml-2 text-gray-500">
          ({reviewCount} {t.reviews})
        </span>
      )}
    </div>
  );
};
