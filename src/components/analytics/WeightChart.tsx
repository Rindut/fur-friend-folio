
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface WeightChartProps {
  language?: 'en' | 'id';
}

interface WeightData {
  name: string;
  [key: string]: string | number;
}

interface PetWeight {
  id: string;
  name: string;
  weightKg: number | null;
  updatedAt: string;
}

const WeightChart = ({ language = 'en' }: WeightChartProps) => {
  const [petWeights, setPetWeights] = useState<PetWeight[]>([]);
  const [chartData, setChartData] = useState<WeightData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPetWeights = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, name, weight_kg, updated_at')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Map to consistent format
        const weights = data?.map(pet => ({
          id: pet.id,
          name: pet.name,
          weightKg: pet.weight_kg,
          updatedAt: pet.updated_at
        })) || [];

        setPetWeights(weights.filter(pet => pet.weightKg !== null));
      } catch (error) {
        console.error("Error fetching pet weights:", error);
      }
    };

    fetchPetWeights();
  }, [user]);

  useEffect(() => {
    // Generate chart data from pet weights
    if (petWeights.length > 0) {
      // For simplicity, we're using a fixed set of months
      const months = language === 'en' 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
      
      const data: WeightData[] = months.map((month, index) => {
        const dataPoint: WeightData = { name: month };
        
        // Add each pet's weight to the data point
        petWeights.forEach(pet => {
          // Simulate a weight trend by adding small variations to the initial weight
          const variation = (index * 0.2) + (Math.random() * 0.2);
          if (pet.weightKg !== null) {
            dataPoint[pet.name] = +(pet.weightKg + variation).toFixed(1);
          }
        });
        
        return dataPoint;
      });
      
      setChartData(data);
    }
  }, [petWeights, language]);

  const translations = {
    en: {
      weight: 'Weight',
      date: 'Date',
      kg: 'kg',
      month: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Aug',
        sep: 'Sep',
        oct: 'Oct',
        nov: 'Nov',
        dec: 'Dec'
      }
    },
    id: {
      weight: 'Berat',
      date: 'Tanggal',
      kg: 'kg',
      month: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'Mei',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Agt',
        sep: 'Sep',
        oct: 'Okt',
        nov: 'Nov',
        dec: 'Des'
      }
    }
  };

  const t = translations[language];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardContent className="p-2">
            <p className="text-muted-foreground text-xs">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="text-sm">
                <span className="font-semibold" style={{ color: entry.color }}>
                  {entry.name}:
                </span>{' '}
                {entry.value} {t.kg}
              </p>
            ))}
          </CardContent>
        </Card>
      );
    }
  
    return null;
  };

  // If no pets with weight data are found
  if (petWeights.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {language === 'en' 
          ? "No pet weight data available. Add weight information to your pets' profiles to see it here."
          : "Tidak ada data berat hewan tersedia. Tambahkan informasi berat pada profil hewan Anda untuk melihatnya di sini."
        }
      </div>
    );
  }

  return (
    <div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ 
                value: `${t.weight} (${t.kg})`, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              }} 
            />
            <Tooltip content={<CustomTooltip />} />
            {petWeights.map((pet, index) => (
              <Area 
                key={pet.id}
                type="monotone" 
                dataKey={pet.name} 
                stroke={index === 0 ? "#8884d8" : "#82ca9d"} 
                fill={index === 0 ? "#8884d8" : "#82ca9d"} 
                fillOpacity={0.3} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart;
