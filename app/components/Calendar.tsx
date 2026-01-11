'use client';

import React from 'react';
import { WorkoutSession } from '../../types';

const Calendar = ({ sessions = [] }: { sessions: WorkoutSession[] }) => {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  
  return (
    <div className="grid grid-cols-7 gap-y-8 gap-x-2">
      {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁ'].map(d => (
        <div key={d} className="text-[10px] font-black text-slate-300 text-center tracking-widest">{d}</div>
      ))}
      {days.map((day) => {
        const hasSession = sessions.some(s => new Date(s.created_at).getDate() === day);
        return (
          <div key={day} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
              ${hasSession ? 'bg-[#10b981] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer'}`}
            >
              {day.toString().padStart(2, '0')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;