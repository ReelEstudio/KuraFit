'use client';

import React, { useState, useMemo } from 'react';

const ProfileDashboard = ({ user }: any) => {
  const [activeChartMetric, setActiveChartMetric] = useState('weight');
  // Estado para controlar el Modal
  const [showSelector, setShowSelector] = useState(false);

  const calendarDays = useMemo(() => {
    const days = [];
    const now = new Date();
    const totalDays = 28;
    for (let i = 0; i < totalDays; i++) {
      const date = new Date();
      date.setDate(now.getDate() - (totalDays - 1 - i));
      const session = user?.workout_sessions?.find((s: any) => {
        const sessionDate = new Date(s.created_at);
        return sessionDate.toDateString() === date.toDateString();
      });
      days.push({
        dayNumber: date.getDate().toString().padStart(2, '0'),
        status: session?.status || 'none'
      });
    }
    return days;
  }, [user?.workout_sessions]);

  // Función para redirigir al entrenamiento seleccionado
  const startWorkout = (type: string) => {
    window.location.href = `/workout?type=${type.toLowerCase()}`;
  };

  return (
    <div className="relative space-y-10 pb-20 bg-[#f8fafc] min-h-screen p-4 md:p-8">
      
      {/* --- MODAL: SELECTOR MANUAL --- */}
      {showSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1f2e]/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 max-w-lg w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black uppercase italic text-[#1a1f2e]">Selector Manual</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Ignorar orden cronológico e iniciar sesión específica
              </p>
            </div>

            <div className="space-y-4">
              <WorkoutOption title="STRENGTH" session="SESIÓN 1" onClick={() => startWorkout('STRENGTH')} />
              <WorkoutOption title="HYPERTROPHY" session="SESIÓN 2" onClick={() => startWorkout('HYPERTROPHY')} />
              <WorkoutOption title="METABOLIC" session="SESIÓN 3" onClick={() => startWorkout('METABOLIC')} />
            </div>

            <button 
              onClick={() => setShowSelector(false)}
              className="w-full mt-8 text-[11px] font-black uppercase text-slate-400 hover:text-[#1a1f2e] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-start max-w-7xl mx-auto w-full">
        <h1 className="text-5xl font-black text-[#1a1f2e] italic uppercase tracking-tighter leading-none">
          Centro de Entrenamiento
        </h1>
        <button className="bg-[#1a1f2e] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-xl">
          Entrenar Ahora
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#1a1f2e] rounded-[30px] flex items-center justify-center text-white text-4xl font-black mb-6">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <h3 className="text-xl font-black text-[#1a1f2e] uppercase italic">{user?.full_name || 'Carlos Andrade'}</h3>
            <div className="w-full mt-8 space-y-4">
               <div className="bg-[#10b981] p-6 rounded-[28px] text-white shadow-lg shadow-emerald-100">
                  <p className="text-[9px] font-black uppercase opacity-80 mb-1">Sesiones Full</p>
                  <p className="text-4xl font-black italic">
                    {user?.workout_sessions?.filter((s:any) => s.status === 'full').length || 0}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <MetricCard label="Peso" value={`${user?.weight_kg || 90} kg`} active={activeChartMetric === 'weight'} />
             <MetricCard label="Grasa" value="20%" active={activeChartMetric === 'fat'} />
             <MetricCard label="Músculo" value="35 kg" active={activeChartMetric === 'muscle'} />
             <MetricCard label="IMC" value="29.4" active={activeChartMetric === 'bmi'} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white rounded-[45px] p-8 shadow-sm border border-slate-50">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-2xl font-black uppercase italic text-[#1a1f2e]">Calendario Semanal</h4>
               </div>
               <div className="grid grid-cols-7 gap-3">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                    <div key={d} className="text-[10px] font-black text-slate-300 uppercase text-center">{d}</div>
                  ))}
                  {calendarDays.map((day, i) => (
                    <div key={i} className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100/50 relative">
                      <span className="text-[10px] font-bold text-slate-400">{day.dayNumber}</span>
                      {day.status === 'full' && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
              {/* BOTÓN QUE ACTIVA EL MODAL */}
              <div className="bg-[#1a1f2e] rounded-[40px] p-8 text-white shadow-xl">
                <p className="text-[10px] font-black uppercase text-blue-400 mb-2">Siguiente Estímulo</p>
                <h4 className="text-3xl font-black italic uppercase leading-none">Strength & Force</h4>
                <button 
                  onClick={() => setShowSelector(true)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-slate-100 text-center">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Plan Nutricional IA</h4>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-sm font-black italic text-emerald-700 uppercase">Déficit Calórico Activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para las opciones del modal
const WorkoutOption = ({ title, session, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex justify-between items-center p-6 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-[25px] transition-all group"
  >
    <div className="text-left">
      <p className="text-[9px] font-bold text-slate-400 mb-1">{session}</p>
      <p className="text-xl font-black italic text-[#1a1f2e] group-hover:text-blue-600 transition-colors">{title}</p>
    </div>
    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Pendiente</span>
  </button>
);

const MetricCard = ({ label, value, active }: any) => (
  <div className={`p-6 rounded-[35px] border ${active ? 'bg-white border-blue-500 shadow-xl' : 'bg-white border-slate-50 shadow-sm'}`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black italic text-[#1a1f2e]">{value}</p>
  </div>
);

export default ProfileDashboard;