'use client';

import React, { useState, useMemo } from 'react';
import { User, MetricEntry, DietType } from '../types';

interface ProfileDashboardProps {
  user: User;
  onAddMetric: (metric: MetricEntry) => void;
}

const DIET_DETAILS: Record<string, { title: string; example: string }> = {
  [DietType.OMNIVORE]: { 
    title: "DIETA BALANCEADA (OMNÍVORA)",
    example: "Pollo a la plancha, arroz integral y brócoli."
  },
};

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ user, onAddMetric }) => {
  const [activeChartMetric, setActiveChartMetric] = useState<'weight' | 'fat' | 'muscle' | 'bmi'>('weight');

  // Cálculos de métricas de usuario
  const currentWeight = user?.weight_kg || 90;
  const bmiVal = useMemo(() => {
    const h = (user?.height_cm || 175) / 100;
    return (currentWeight / (h * h)).toFixed(1);
  }, [currentWeight, user?.height_cm]);

  // LÓGICA DE SESIONES (SUPABASE)
  const completedSessions = useMemo(() => 
    user?.workout_sessions?.filter(s => s.status === 'full').length || 0
  , [user?.workout_sessions]);

  const earlySessions = useMemo(() => 
    user?.workout_sessions?.filter(s => s.status === 'early').length || 0
  , [user?.workout_sessions]);

  return (
    <div className="space-y-10 pb-20 bg-[#f8fafc] min-h-screen p-4 md:p-8">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex justify-between items-start max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-5xl font-black text-[#1a1f2e] italic tracking-tighter uppercase leading-none">
            Centro de Entrenamiento
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">
            Status biomecánico para <span className="text-slate-600">{user?.full_name || 'Carlos Andrade'}</span>
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/workout'}
          className="bg-[#1a1f2e] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-transform shadow-xl"
        >
          Entrenar Ahora
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: PERFIL Y CONTADORES */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#1a1f2e] rounded-[30px] flex items-center justify-center text-white text-4xl font-black mb-6">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <h3 className="text-xl font-black text-[#1a1f2e] uppercase italic tracking-tight mb-8">
              {user?.full_name || 'Carlos Andrade'}
            </h3>

            {/* CONTADORES DE SESIONES */}
            <div className="w-full space-y-4">
              {/* SESIONES COMPLETADAS */}
              <div className="w-full bg-[#10b981] rounded-[28px] p-6 text-white shadow-lg shadow-emerald-100 transition-transform hover:scale-[1.02]">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Sesiones Full</p>
                <p className="text-5xl font-black italic leading-none">{completedSessions}</p>
              </div>

              {/* SESIONES TEMPRANAS */}
              <div className="w-full bg-[#f59e0b] rounded-[28px] p-6 text-white shadow-lg shadow-orange-100 transition-transform hover:scale-[1.02]">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Finalizadas Antes</p>
                <p className="text-5xl font-black italic leading-none">{earlySessions}</p>
              </div>
            </div>

            <div className="w-full mt-8 pt-6 border-t border-slate-50 space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Nivel IA</span>
                <span className="text-blue-600 italic">Beginner</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Lesiones</span>
                <span className="text-orange-500">{user?.injuries?.length || 0} Activas</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA CENTRAL: DASHBOARD DE MÉTRICAS */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon="⚖️" label="Peso" value={`${currentWeight} kg`} active={activeChartMetric === 'weight'} onClick={() => setActiveChartMetric('weight')} />
            <MetricCard icon="🔥" label="Grasa" value="20%" active={activeChartMetric === 'fat'} onClick={() => setActiveChartMetric('fat')} />
            <MetricCard icon="💪" label="Músculo" value="35 kg" active={activeChartMetric === 'muscle'} onClick={() => setActiveChartMetric('muscle')} />
            <MetricCard icon="📊" label="IMC" value={bmiVal} active={activeChartMetric === 'bmi'} onClick={() => setActiveChartMetric('bmi')} />
          </div>

          {/* PANEL DE DETALLE */}
          <div className="bg-[#1a1f2e] rounded-[45px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-3xl font-black italic uppercase mb-8 flex items-center gap-3">
                  <span className="text-slate-500">⚖️</span> {activeChartMetric.toUpperCase()}
                </h4>
                <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 flex-1">
                    <p className="text-[9px] font-black text-blue-400 uppercase mb-2">Valor Actual</p>
                    <p className="text-3xl font-black italic">{currentWeight} kg</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 flex-1">
                    <p className="text-[9px] font-black text-emerald-400 uppercase mb-2">Rango Ideal</p>
                    <p className="text-3xl font-black italic">63 - 84 kg</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <StatusRow label="Estrés Sistema" value="Nivel 3/5" color="bg-emerald-400" />
                <StatusRow label="Calidad Sueño" value="Nivel 3/5" color="bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[45px] p-10 shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-bold text-[#1a1f2e] tracking-tight">Calendario Semanal</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Planificación de Cargas</p>
            </div>
            <div className="flex gap-4">
              <LegendItem color="bg-emerald-400" label="Completado" />
              <LegendItem color="bg-blue-500" label="En Progreso" />
            </div>
          </div>
          <CalendarGrid />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <h3 className="text-sm font-black text-[#1a1f2e] uppercase italic mb-4 ml-4">Siguiente Estímulo</h3>
          <div className="bg-white rounded-[45px] p-4 shadow-xl border border-slate-50 flex-1 flex flex-col">
            <div className="bg-[#1a1f2e] rounded-[35px] p-10 text-white relative overflow-hidden mb-6 flex-1 flex flex-col justify-center">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Enfoque de Hoy</p>
              <h4 className="text-5xl font-black italic uppercase tracking-tighter">Strength</h4>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/workout'}
              className="w-full py-6 bg-[#4361ee] hover:bg-blue-700 text-white rounded-[30px] font-black uppercase italic tracking-wider transition-all shadow-lg shadow-blue-200"
              >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, active, onClick }: any) => (
  <button onClick={onClick} className={`p-6 rounded-[35px] border transition-all text-left flex flex-col justify-between h-40 ${active ? 'bg-white border-blue-500 ring-[6px] ring-blue-50 shadow-xl' : 'bg-white border-slate-50 shadow-sm hover:border-slate-200'}`}>
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black italic text-[#1a1f2e]">{value}</p>
    </div>
  </button>
);

const StatusRow = ({ label, value, color }: any) => (
  <div className="bg-white/5 px-6 py-4 rounded-[25px] border border-white/10 flex justify-between items-center">
    <span className="text-[11px] font-black uppercase tracking-tight text-slate-400">{label}: <span className="text-white">{value}</span></span>
    <div className={`w-2 h-2 rounded-full ${color}`} />
  </div>
);

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 ${color} rounded-full`} />
    <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
  </div>
);

const CalendarGrid = () => (
  <div className="grid grid-cols-7 gap-4">
    {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(d => (
      <div key={d} className="text-center text-[11px] font-black text-slate-300 mb-2">{d}</div>
    ))}
    {Array.from({ length: 14 }).map((_, i) => {
      const day = i + 1;
      const isToday = day === 11;
      return (
        <div key={i} className={`aspect-[4/5] rounded-[22px] border-2 p-3 relative transition-all ${isToday ? 'border-blue-500 bg-blue-50/30' : 'border-slate-50 hover:border-slate-100'}`}>
          <span className={`text-xs font-black ${isToday ? 'text-blue-600' : 'text-slate-300'}`}>{day.toString().padStart(2, '0')}</span>
          {isToday && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
          {day === 12 && <div className="mt-auto bg-orange-50 text-orange-600 text-[9px] font-black p-1.5 rounded-lg text-center uppercase">S...</div>}
        </div>
      );
    })}
  </div>
);

export default ProfileDashboard;