'use client';
import React from 'react';

const Calendar = ({ sessions = [] }: { sessions: any[] }) => {
  // Generamos los 28 días que se ven en tu captura
  const days = Array.from({ length: 28 }, (_, i) => i + 15); // Empezando en 15 como la imagen
  
  return (
    <div className="grid grid-cols-7 gap-y-8 gap-x-2">
      {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁ'].map(d => (
        <div key={d} className="text-[10px] font-black text-slate-300 text-center tracking-widest">{d}</div>
      ))}
      {days.map((day, index) => {
        // En tu imagen son todos círculos grises claros (sin sesiones aún)
        const displayDay = day > 31 ? day - 31 : day;
        return (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
              {displayDay.toString().padStart(2, '0')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;