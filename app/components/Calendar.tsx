'use client';
import React from 'react';
// RUTA CORREGIDA (un nivel)
import { WorkoutSession } from '../types';

const Calendar = ({ sessions = [] }: { sessions: any[] }) => {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  
  return (
    <div className="grid grid-cols-7 gap-y-10 gap-x-3">
      {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁ'].map(d => (
        <div key={d} className="text-[10px] font-black text-slate-300 text-center tracking-[0.2em]">{d}</div>
      ))}
      {days.map((day) => {
        const hasSession = sessions && sessions.some(s => {
            const date = s.created_at ? new Date(s.created_at) : new Date(s.date);
            return date.getDate() === day;
        });
        return (
          <div key={day} className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[12px] font-black transition-all duration-500
              ${hasSession 
                ? 'bg-[#10b981] text-white shadow-2xl shadow-emerald-200 scale-110 border-4 border-emerald-50' 
                : 'bg-white text-slate-300 border-2 border-slate-50 hover:border-slate-200 hover:text-slate-400 cursor-pointer shadow-sm'}`}
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