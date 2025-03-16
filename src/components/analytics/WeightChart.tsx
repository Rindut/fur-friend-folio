
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface WeightData {
  id: string;
  name: string;
  weight: number;
  date: string;
  formattedDate: string;
}

export const WeightChart = () => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, name, weight, updated_at')
          .eq('user_id', user.id)
          .is('weight', 'not.null')
          .order('updated_at', { ascending: true });

        if (error) throw error;

        // Transform the data for the chart
        const formattedData = data.map(pet => ({
          id: pet.id,
          name: pet.name,
          weight: parseFloat(pet.weight) || 0,
          date: pet.updated_at,
          formattedDate: formatDistanceToNow(new Date(pet.updated_at), { addSuffix: true })
        }));

        setWeightData(formattedData);
      } catch (error) {
        console.error('Error fetching weight data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeightData();
  }, [user]);

  // If we don't have any weight data yet, show a message
  if (!loading && weightData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pet Weight Tracking</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No weight data available yet. Add weight information to your pets to see it tracked here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pet Weight Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <p>Loading weight data...</p>
          </div>
        ) : (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={weightData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Weight (kg)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#FF7E5F" 
                    activeDot={{ r: 8 }} 
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <Label>Pets Tracked</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(new Set(weightData.map(item => item.name))).map((name, idx) => (
                  <div key={idx} className="px-3 py-1 text-sm rounded-full bg-lavender/20 text-primary">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightChart;
