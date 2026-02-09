import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartPoint } from '../../types/analytics';

interface Props {
  data: ChartPoint[];
}

export default function EquityCurveChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full p-2">
      <h3 className="text-sm font-bold text-gray-400 mb-4 font-orbitron tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse"></span>
          EQUITY CURVE
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 255, 136, 0.1)" />
          <XAxis 
            dataKey="label" 
            hide={true}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'monospace' }}
            tickFormatter={(val) => `$${val}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: any) => [`$${(value || 0).toFixed(2)}`, 'Equity']}
            contentStyle={{ 
                backgroundColor: 'rgba(5, 8, 16, 0.95)', 
                borderColor: 'rgba(0, 255, 136, 0.3)', 
                borderRadius: '8px', 
                color: '#E0E0E0',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)'
            }}
            itemStyle={{ color: '#00FF88' }}
            labelStyle={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: '10px' }}
          />
          <defs>
             <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00FF88" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#00AA55" stopOpacity={1}/>
             </linearGradient>
             <filter id="neon-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
          </defs>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#lineGradient)" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#00FF88', strokeWidth: 2 }}
            filter="url(#neon-glow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
