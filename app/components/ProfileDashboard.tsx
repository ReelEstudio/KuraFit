'use client';

import React, { useState, useMemo } from 'react';

const ProfileDashboard = ({ user, onAddMetric }: any) => {
  const [activeChartMetric, setActiveChartMetric] = useState<'weight' | 'fat' | 'muscle' | 'bmi'>('weight');

  const currentWeight = user?.weight_kg || 90;
  
  const bmiVal = useMemo(() => {
    const h = (user?.height_cm || 175) / 100;
    return (currentWeight / (h * h)).toFixed(1);
  }, [currentWeight, user?.height_cm]);

  const completedSessions = useMemo(() => 
    user?.workout_sessions?.filter((s: any) => s.status === 'full').length || 0
  , [user?.workout_sessions]);

  const earlySessions = useMemo(() => 
    user?.workout_sessions?.filter((s: any) => s.status === 'early').length || 0
  , [user?.workout_sessions]);

  return (
    <div className="space-y-10 pb-20 bg-[#f8fafc] min-h-screen p-4 md:p-8">
      {/* HEADER */}
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
        {/* SIDEBAR IZQUIERDO */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#1a1f2e] rounded-[30px] flex items-center justify-center text-white text-4xl font-black mb-6">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <h3 className="text-xl font-black text-[#1a1f2e] uppercase italic mb-8">
              {user?.full_name || 'Carlos Andrade'}
            </h3>

            <div className="w-full space-y-4">
              <div className="w-full bg-[#10b981] rounded-[28px] p-6 text-white shadow-lg shadow-emerald-100">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-90">Sesiones Full</p>
                <p className="text-5xl font-black italic leading-none">{completedSessions}</p>
              </div>

              <div className="w-full bg-[#f59e0b] rounded-[28px] p-6 text-white shadow-lg shadow-orange-100">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-90">Terminadas Antes</p>
                <p className="text-5xl font-black italic leading-none">{earlySessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon="⚖️" label="Peso" value={`${currentWeight} kg`} active={activeChartMetric === 'weight'} onClick={() => setActiveChartMetric('weight')} />
            <MetricCard icon="🔥" label="Grasa" value="20%" active={activeChartMetric === 'fat'} onClick={() => setActiveChartMetric('fat')} />
            <MetricCard icon="💪" label="Músculo" value="35 kg" active={activeChartMetric === 'muscle'} onClick={() => setActiveChartMetric('muscle')} />
            <MetricCard icon="📊" label="IMC" value={bmiVal} active={activeChartMetric === 'bmi'} onClick={() => setActiveChartMetric('bmi')} />
          </div>

          <div className="bg-[#1a1f2e] rounded-[45px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-3xl font-black italic uppercase mb-8">
                   {activeChartMetric.toUpperCase()}
                </h4>
                <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 flex-1">
                    <p className="text-[9px] font-black text-blue-400 uppercase mb-2">Valor Actual</p>
                    <p className="text-3xl font-black italic">{currentWeight} kg</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 flex-1">
                    <p className="text-[9px] font-black text-emerald-400 uppercase mb-2">Rango Ideal</p>
                    <p className="text-3xl font-black italic">63-84 kg</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <StatusRow label="Estrés" value="Nivel 3/5" color="bg-emerald-400" />
                <StatusRow label="Sueño" value="Nivel 3/5" color="bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* NUEVA SECCIÓN: PLAN NUTRICIONAL Y PROTOCOLOS (Lo que faltaba) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
               <h4 className="text-xl font-black uppercase italic mb-6">Plan Nutricional IA</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold uppercase text-slate-500">Calorías Diarias</span>
                    <span className="font-black italic text-slate-800">2,400 kcal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <MacroBox label="Prot" value="180g" color="text-red-500" />
                    <MacroBox label="Carb" value="250g" color="text-blue-500" />
                    <MacroBox label="Fat" value="70g" color="text-orange-500" />
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
               <h4 className="text-xl font-black uppercase italic mb-6">Protocolos</h4>
               <div className="relative rounded-3xl overflow-hidden h-32 bg-slate-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-black uppercase italic">Protocolo de Bioseguridad</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES
const MetricCard = ({ icon, label, value, active, onClick }: any) => (
  <button onClick={onClick} className={`p-6 rounded-[35px] border transition-all text-left flex flex-col justify-between h-40 ${active ? 'bg-white border-blue-500 ring-[6px] ring-blue-50 shadow-xl' : 'bg-white border-slate-50 shadow-sm'}`}>
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

const MacroBox = ({ label, value, color }: any) => (
  <div className="bg-white border border-slate-100 p-3 rounded-xl text-center">
    <p className="text-[8px] font-black uppercase text-slate-400">{label}</p>
    <p className={`text-sm font-black italic ${color}`}>{value}</p>
  </div>
);

export default ProfileDashboard;