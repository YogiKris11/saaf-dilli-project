'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ForecastData } from '@/lib/types';
import { getAqiInfo } from '../../citizen/_components/aqi-badge';

interface ForecastChartProps {
    data: ForecastData | null;
}

const formatXAxis = (tickItem: string) => {
    if (tickItem.endsWith(' 0:00')) {
        return tickItem.split(' ')[0]; // Returns "Mon", "Tue", etc.
    }
    return '';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aqi = payload[0].payload.AQI;
    const { level, color } = getAqiInfo(aqi);
    return (
      <div className="p-4 bg-background/80 backdrop-blur-sm border rounded-lg shadow-xl">
        <p className="label font-semibold">{`${label}`}</p>
        <p className="intro" style={{color: color.replace('bg-','text-').replace('-500','').replace('-600','').replace('-900','')}}>
            Overall AQI: <span className="font-bold">{aqi} ({level})</span>
        </p>
        <div className="mt-2 space-y-1 text-sm">
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color }}>
                    {`${p.name}: ${p.value}`}
                </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};


export default function ForecastChart({ data }: ForecastChartProps) {
  if (!data) return null;

  const chartData = data.pm25.map((point, index) => {
    const pm25 = data.pm25[index].avg;
    const pm10 = data.pm10[index].avg;
    const o3 = data.o3[index].avg;
    
    const overallAqi = Math.max(pm25, pm10, o3);

    return {
      hour: point.day,
      AQI: overallAqi,
      'PM2.5': pm25,
      'PM10': pm10,
      'Ozone': o3,
    }
  });

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis 
            dataKey="hour" 
            tickFormatter={formatXAxis}
            interval={3}
            tickLine={false}
            axisLine={false}
            height={40}
            fontSize={12}
            />
          <YAxis 
            label={{ value: 'AQI', angle: -90, position: 'insideLeft' }} 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px' }} iconType="circle" />
          <Line type="monotone" dataKey="AQI" stroke="hsl(var(--destructive))" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="PM2.5" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="PM10" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Ozone" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
