
import React from 'react';
import { WorkoutSession, WorkoutFocus } from '../types';

interface CalendarProps {
  sessions: WorkoutSession[];
}

const FocusIcon: React.FC<{ focus: WorkoutFocus; className?: string }> = ({ focus, className }) => {
  switch (focus) {
    case WorkoutFocus.STRENGTH:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7h2m14 0h2M5 7h14M7 5v4m10-4v4M9 12h6m-7 5h8M2 12h2m16 0h2M5 12h14" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case WorkoutFocus.HYPERTROPHY:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      );
    case WorkoutFocus.METABOLIC:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" />
        </svg>
      );
    case WorkoutFocus.PERFORMANCE:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 21h8m-4-4v4M7 4h10M8 4c0 4 0 7 4 7s4-3 4-7M5 8c0 2 1 3 3 3m8 0c2 0 3-1 3-3" />
        </svg>
      );
    default:
      return null;
  }
};

const Calendar: React.FC<CalendarProps> = ({ sessions }) => {
  const daysInMonth = 30; 
  const today = new Date().getDate();

  const getSessionForDay = (day: number) => {
    return sessions.find(s => s.date.getDate() === day);
  };

  const getFocusStyles = (focus: WorkoutFocus) => {
    switch (focus) {
      case WorkoutFocus.STRENGTH: return 'bg-red-50 text-red-700 border-red-100 shadow-red-100/50';
      case WorkoutFocus.HYPERTROPHY: return 'bg-purple-50 text-purple-700 border-purple-100 shadow-purple-100/50';
      case WorkoutFocus.METABOLIC: return 'bg-orange-50 text-orange-700 border-orange-100 shadow-orange-100/50';
      case WorkoutFocus.PERFORMANCE: return 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/50';
      default: return 'bg-blue-50 text-blue-700 border-blue-100 shadow-blue-100/50';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col h-full border border-slate-100 overflow-hidden">
      {/* Header static area */}
      <div className="p-4 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Calendario Semanal</h2>
            <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest">Planificación de Cargas</p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-2 md:px-3 py-1.5 rounded-full border border-slate-100">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200"></div>
              <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">Completado</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-2 md:px-3 py-1.5 rounded-full border border-slate-100">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full shadow-sm shadow-blue-200"></div>
              <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">En Progreso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekdays header - Sticky */}
      <div className="sticky top-0 z-20 bg-white px-4 md:px-8 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-7 gap-1 md:gap-3 py-4 border-b border-slate-50">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable days grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 custom-scrollbar">
        <div className="grid grid-cols-7 gap-1 md:gap-3">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const session = getSessionForDay(day);
            const isPast = day < today;
            const isToday = day === today;

            return (
              <div 
                key={day} 
                className={`
                  min-h-[80px] md:min-h-[110px] p-1.5 md:p-2 rounded-xl md:rounded-2xl border transition-all duration-300 cursor-pointer
                  ${isToday 
                    ? 'border-blue-500 bg-blue-50/30 ring-2 md:ring-4 ring-blue-50 shadow-lg shadow-blue-100/50' 
                    : 'border-slate-50 bg-slate-50/20 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1'}
                  ${isPast && !session ? 'opacity-40' : 'opacity-100'}
                `}
              >
                <div className="flex justify-between items-center mb-1 px-0.5 md:px-1">
                  <span className={`text-[8px] md:text-[10px] font-black ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                    {day < 10 ? `0${day}` : day}
                  </span>
                  {isToday && (
                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                
                {session && (
                  <div className={`
                    mt-0.5 md:mt-1 p-1 md:p-2.5 rounded-lg md:rounded-xl border md:border-2 transition-all duration-300
                    hover:scale-105 hover:shadow-lg active:scale-95
                    ${getFocusStyles(session.focus)}
                  `}>
                    <div className="flex items-center gap-1 mb-1 md:mb-1.5">
                      <FocusIcon focus={session.focus} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
                      <p className="font-black text-[7px] md:text-[9px] uppercase tracking-tighter leading-none truncate">{session.focus}</p>
                    </div>
                    <div className="space-y-0.5 md:space-y-1 hidden xs:block">
                       <p className="text-[6px] md:text-[8px] font-bold opacity-80 leading-none truncate">
                         {session.exercises.length} Ej
                       </p>
                       <div className="flex gap-0.5">
                         {session.exercises.slice(0, 3).map((_, idx) => (
                           <div key={idx} className="h-0.5 md:h-1 w-1.5 md:w-2.5 rounded-full bg-current opacity-20"></div>
                         ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
