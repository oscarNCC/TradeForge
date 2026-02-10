import { useState, useMemo } from 'react';
import type { ChartPoint } from '../../types/analytics';

interface Props {
  data: ChartPoint[];
  /** When true, entrance animation runs (e.g. when scrolled into view). Default true. */
  playAnimation?: boolean;
}

export default function DailyHeatmap({ data, playAnimation = true }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const map = new Map<number, number>(); // day -> value

    data.forEach(d => {
      const date = new Date(d.label);
      if (date.getFullYear() === year && date.getMonth() === month) {
        map.set(date.getDate(), d.value);
      }
    });
    return map;
  }, [currentDate, data]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];

    // Empty cells
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-14 bg-[#0A0F1E]/30 border border-gray-800/50 rounded-md"></div>);
    }

    // Day cells
    for (let day = 1; day <= totalDays; day++) {
        const val = monthData.get(day);
        let bgColor = 'bg-[#131b2e]/60';
        let borderColor = 'border-gray-800';
        let textColor = 'text-gray-500';
        let glow = '';

        if (val !== undefined) {
            if (val > 0) {
                bgColor = 'bg-green-500/10';
                borderColor = 'border-green-500/50';
                textColor = 'text-[#00FF88]';
                glow = 'group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]';
            } else if (val < 0) {
                bgColor = 'bg-red-500/10';
                borderColor = 'border-red-500/50';
                textColor = 'text-red-500';
                glow = 'group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]';
            } else {
                textColor = 'text-gray-400';
            }
        }

        days.push(
            <div 
                key={day} 
                className={`h-14 p-1.5 border rounded-md flex flex-col justify-between transition-all duration-300 relative group backdrop-blur-sm ${bgColor} ${borderColor} ${glow} hover:border-opacity-100 hover:scale-[1.02]`}
            >
                <span className={`text-sm font-semibold font-orbitron ${textColor}`}>{day}</span>
                {val !== undefined && (
                    <div className="text-right">
                        <p className={`text-xs font-bold font-mono ${val > 0 ? 'text-[#00FF88] drop-shadow-[0_0_2px_rgba(0,255,136,0.8)]' : (val < 0 ? 'text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.8)]' : 'text-gray-500')}`}>
                            {val > 0 ? '+' : ''}{val.toFixed(2)}
                        </p>
                    </div>
                )}
                
                {val !== undefined && (
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#050810] border border-[#00FF88]/30 text-[#00FF88] text-xs rounded shadow-[0_0_10px_rgba(0,0,0,0.8)] whitespace-nowrap z-10 pointer-events-none transition-opacity">
                    {currentDate.getFullYear()}-{String(currentDate.getMonth() + 1).padStart(2, '0')}-{String(day).padStart(2, '0')}: ${val.toFixed(2)}
                  </div>
                )}
            </div>
        );
    }
    return days;
  };

  return (
    <div className={`bg-[#050810]/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#00FF88]/20 backdrop-blur-md max-w-3xl transition-all duration-700 ${playAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-[#00FF88] uppercase tracking-wider font-orbitron flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse"></span>
            Daily P&L Calendar
        </h3>
        <div className="flex items-center space-x-4">
            <button onClick={prevMonth} className="p-1 hover:bg-[#00FF88]/20 text-gray-500 hover:text-[#00FF88] rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <span className="text-lg font-bold text-gray-200 w-32 text-center font-orbitron tracking-wide">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-[#00FF88]/20 text-gray-500 hover:text-[#00FF88] rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-600 uppercase font-mono tracking-widest">
                {d}
            </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {renderCalendar()}
      </div>
    </div>
  );
}
