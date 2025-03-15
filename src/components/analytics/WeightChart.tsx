
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine
} from "recharts";

interface WeightDataPoint {
  date: string;
  value: number;
}

interface WeightChartProps {
  data: WeightDataPoint[];
  showDetails?: boolean;
}

const WeightChart = ({ data, showDetails = false }: WeightChartProps) => {
  // Calculate min and max for y-axis
  const minWeight = Math.floor(Math.min(...data.map(d => d.value))) - 1;
  const maxWeight = Math.ceil(Math.max(...data.map(d => d.value))) + 1;
  
  // Format the dates for display
  const formattedData = data.map(point => ({
    ...point,
    formattedDate: new Date(point.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));
  
  // Calculate ideal weight range
  const idealWeightMin = Math.round(data[0].value * 0.9);
  const idealWeightMax = Math.round(data[0].value * 1.1);
  
  return (
    <div className="w-full h-full min-h-[200px]">
      <ChartContainer
        config={{
          weight: {
            label: "Weight",
            color: "#FF7E67" // coral color
          },
          ideal: {
            label: "Ideal Range",
            color: "#A2D5AB" // sage color
          }
        }}
      >
        <ResponsiveContainer width="100%" height={showDetails ? 300 : 200}>
          <LineChart
            data={formattedData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            {showDetails && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            )}
            
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickLine={showDetails}
              axisLine={showDetails}
            />
            
            <YAxis 
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 12 }}
              tickLine={showDetails}
              axisLine={showDetails}
              tickCount={5}
              width={30}
            />
            
            {showDetails && (
              <>
                <ReferenceLine 
                  y={idealWeightMin} 
                  stroke="#A2D5AB" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Min Ideal', 
                    position: 'insideLeft',
                    fill: '#A2D5AB',
                    fontSize: 10 
                  }} 
                />
                <ReferenceLine 
                  y={idealWeightMax} 
                  stroke="#A2D5AB" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Max Ideal', 
                    position: 'insideLeft',
                    fill: '#A2D5AB',
                    fontSize: 10 
                  }} 
                />
              </>
            )}
            
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => [
                    `${value} lbs`,
                    name === "value" ? "Weight" : name,
                  ]}
                />
              }
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--coral)"
              strokeWidth={2}
              dot={{
                stroke: 'var(--coral)',
                strokeWidth: 2,
                r: 4,
                fill: 'white'
              }}
              activeDot={{ r: 6, fill: 'var(--coral)' }}
              name="weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default WeightChart;
