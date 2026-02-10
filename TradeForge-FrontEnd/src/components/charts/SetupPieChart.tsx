import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { LegendPayload } from 'recharts';
import type { ChartPoint } from '../../types/analytics';

interface Props {
  data: ChartPoint[];
  /** When false, chart animation does not run (e.g. until in view). Default true. */
  playAnimation?: boolean;
}

const COLORS = ['#00FF88', '#00CCFF', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

function renderLegend(props: { payload?: readonly LegendPayload[] }) {
  const { payload = [] } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 list-none m-0 p-0 text-[11px] text-gray-400">
      {payload.map((entry, index) => (
        <li key={index} className="flex items-center gap-1.5">
          <span
            className="shrink-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color ?? COLORS[index % COLORS.length] }}
          />
          <span>{entry.value ?? ''}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SetupPieChart({ data, playAnimation = true }: Props) {
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
              label={false}
              outerRadius={80}
              innerRadius={50}
              dataKey="value"
              nameKey="label"
              stroke="none"
              paddingAngle={2}
              isAnimationActive={playAnimation}
              animationBegin={0}
              animationDuration={800}
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
              formatter={(value: any, name: any) => [typeof value === 'number' ? `$${value.toFixed(2)}` : value, name || '']}
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
              height={72}
              content={renderLegend}
              wrapperStyle={{ width: '100%' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
