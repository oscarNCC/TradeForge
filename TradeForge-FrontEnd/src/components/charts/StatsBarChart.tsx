import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ChartPoint } from '../../types/analytics';

interface Props {
  data: ChartPoint[];
  title: string;
  /** When false, chart animation does not run (e.g. until in view). Default true. */
  playAnimation?: boolean;
}

export default function StatsBarChart({ data, title, playAnimation = true }: Props) {
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
            tick={false}
            axisLine={false}
            tickLine={false}
            height={8}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'monospace' }}
            tickFormatter={(val) => `$${val}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 255, 136, 0.05)' }}
            labelFormatter={(label) => label}
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
          <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={playAnimation} animationBegin={0} animationDuration={800}>
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
