'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface ChartProps {
  data: { period: string; value: number, fill: string }[];
  yAxisLabel: string;
}

export default function PolicyComparisonChart({ data, yAxisLabel }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" dataKey="value" />
          <YAxis 
            type="category" 
            dataKey="period" 
            width={100}
            tickLine={false}
            axisLine={false}
            />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
             <LabelList dataKey="value" position="right" offset={10} className="font-semibold fill-foreground" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
