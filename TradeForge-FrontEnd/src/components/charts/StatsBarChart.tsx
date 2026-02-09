import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ChartPoint } from '../../types/analytics';

interface Props {
  data: ChartPoint[];
  title: string;
}

export default function StatsBarChart({ data, title }: Props) {
  return (
    <div className="h-[300px] w-full p-2">
      <h3 className="text-sm font-bold text-gray-400 mb-4 font-orbitron tracking-wider flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse"></span>
           {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 255, 136, 0.1)" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'monospace' }}
            tickFormatter={(val) => `$${val}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 255, 136, 0.05)' }}
            formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'PnL']}
            contentStyle={{ 
                backgroundColor: 'rgba(5, 8, 16, 0.95)', 
                borderColor: 'rgba(0, 255, 136, 0.3)', 
                borderRadius: '8px', 
                color: '#E0E0E0',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)'
            }}
            labelStyle={{ color: '#9CA3AF', fontFamily: 'monospace' }}
            itemStyle={{ color: '#00FF88' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value >= 0 ? '#00FF88' : '#EF4444'} 
                fillOpacity={0.8}
                stroke={entry.value >= 0 ? '#00FF88' : '#EF4444'}
                strokeWidth={1}
                className="hover:opacity-100 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
