import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartPoint } from '../../types/analytics';

interface Props {
  data: ChartPoint[];
}

const COLORS = ['#00FF88', '#00CCFF', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SetupPieChart({ data }: Props) {
  return (
    <div className="min-h-[300px] p-2 flex flex-col items-center justify-center">
      <h3 className="text-sm font-bold text-gray-400 mb-2 font-orbitron tracking-wider w-full text-left">SETUP DISTRIBUTION</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name || ''} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={50}
              dataKey="count"
              nameKey="label"
              stroke="none"
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any) => [`${value || 0} trades`, name || '']}
              contentStyle={{ 
                backgroundColor: 'rgba(5, 8, 16, 0.95)', 
                borderColor: 'rgba(0, 255, 136, 0.3)', 
                borderRadius: '8px', 
                color: '#E0E0E0'
            }}
            itemStyle={{ color: '#E0E0E0' }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', opacity: 0.8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
