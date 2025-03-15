
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface WeightChartProps {
  language?: 'en' | 'id';
}

const WeightChart = ({ language = 'en' }: WeightChartProps) => {
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

  const data = [
    {
      name: t.month.jan,
      Luna: 24,
      Max: 12,
    },
    {
      name: t.month.feb,
      Luna: 24.5,
      Max: 12.2,
    },
    {
      name: t.month.mar,
      Luna: 25,
      Max: 12.5,
    },
    {
      name: t.month.apr,
      Luna: 25.2,
      Max: 12.8,
    },
    {
      name: t.month.may,
      Luna: 25.8,
      Max: 13,
    },
    {
      name: t.month.jun,
      Luna: 26,
      Max: 13.2,
    },
  ];

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

  return (
    <div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
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
            <Area type="monotone" dataKey="Luna" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            <Area type="monotone" dataKey="Max" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart;
