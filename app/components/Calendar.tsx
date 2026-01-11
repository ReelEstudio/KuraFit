'use client';
import React from 'react';
// RUTA CORREGIDA PARA VERCEL
import { WorkoutSession } from '../types';

const Calendar = ({ sessions = [] }: { sessions: any[] }) => {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  
  return (
    <div className="grid grid-cols-7 gap-y-10 gap-x-3">
      {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁ'].map(d => (
        <div key={d} className="text-[10px] font-black text-slate-300 text-center tracking-widest">{d}</div>
      ))}
      {days.map((day) => {
        const hasSession = sessions && sessions.some(s => {
            const date = s.created_at ? new Date(s.created_at) : new Date(s.date);
            return date.getDate() === day;
        });
        return (
          <div key={day} className="flex flex-col items-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-[12px] font-black transition-all
              ${hasSession 
                ? 'bg-[#10b981] text-white shadow-xl shadow-emerald-100 scale-110' 
                : 'bg-white text-slate-300 border-2 border-slate-50 hover:border-slate-100 hover:text-slate-400 cursor-pointer'}`}
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