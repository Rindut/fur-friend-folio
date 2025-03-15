
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const ServiceCardSkeleton = () => (
  <Card className="animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </CardContent>
    <CardFooter>
      <div className="h-9 bg-gray-200 rounded w-full"></div>
    </CardFooter>
  </Card>
);

export default ServiceCardSkeleton;
