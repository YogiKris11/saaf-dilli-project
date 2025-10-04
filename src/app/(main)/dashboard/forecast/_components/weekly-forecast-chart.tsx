'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { WeeklyForecastDataPoint } from '@/lib/types';
import { getAqiInfo } from '../../citizen/_components/aqi-badge';
import { useTheme } from 'next-themes';

interface WeeklyForecastChartProps {
    data: WeeklyForecastDataPoint[] | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aqi = payload[0].value;
    const { level, color } = getAqiInfo(aqi);
    const textColor = color.replace('bg-', 'text-').replace('-900', '-500').replace('-600', '-500');

    return (
      <div className="p-4 bg-background/80 backdrop-blur-sm border rounded-lg shadow-xl">
        <p className="label font-semibold">{label}</p>
        <p className={`intro ${textColor}`}>
            Avg. AQI: <span className="font-bold">{aqi} ({level})</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyForecastChart({ data }: WeeklyForecastChartProps) {
  if (!data) return null;
  const { theme } = useTheme();

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
          <XAxis 
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={12}
           />
          <YAxis 
             axisLine={false}
             tickLine={false}
             fontSize={12}
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => {
                const { color } = getAqiInfo(entry.aqi);
                // The colors are Tailwind classes like 'bg-green-500'. We need to convert them to HSL values for recharts.
                // This is a simplified conversion. For a perfect match, you'd map class names to the exact HSL values from your globals.css
                let fill = '';
                if (color.includes('green')) fill = 'hsl(var(--chart-2))';
                else if (color.includes('yellow')) fill = 'hsl(var(--chart-4))';
                else if (color.includes('orange')) fill = 'hsl(var(--chart-5))';
                else if (color.includes('red')) fill = 'hsl(var(--destructive))';
                else if (color.includes('purple')) fill = 'hsl(var(--chart-3))';
                else if (color.includes('rose')) fill = 'hsl(var(--destructive))';
                else fill = 'hsl(var(--primary))';

              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
