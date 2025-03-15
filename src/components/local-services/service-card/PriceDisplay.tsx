
interface PriceDisplayProps {
  priceRange?: number;
}

export const PriceDisplay = ({ priceRange }: PriceDisplayProps) => {
  if (!priceRange) return null;
  
  return (
    <span className="font-medium text-gray-700">
      {[...Array(priceRange)].map((_, i) => '₨').join('')}
    </span>
  );
};
