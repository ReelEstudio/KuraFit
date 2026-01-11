'use client';

import React, { useState } from 'react';

const ProfileDashboard = ({ user }: any) => {
  const [showSelector, setShowSelector] = useState(false);

  // PUNTO 1 CORREGIDO: Función para el botón Entrenar Ahora
  const handleTrainNow = () => setShowSelector(true);

  return (
    <div className="relative space-y-10 pb-20 bg-[#f8fafc] min-h-screen p-8">
      {/* MODAL SELECTOR (Tu segunda imagen) */}
      {showSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1f2e]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[50px] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-3xl font-black uppercase italic text-center mb-8">Selector Manual</h2>
            <div className="space-y-4">
               <button onClick={() => window.location.href='/workout?type=strength'} className="w-full p-6 bg-slate-50 rounded-3xl flex justify-between items-center hover:bg-blue-50 transition-colors group">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400">SESIÓN 1</p>
                    <p className="text-xl font-black italic group-hover:text-blue-600">STRENGTH</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-300">PENDIENTE</span>
               </button>
               {/* Repetir para Hypertrophy y Metabolic... */}
            </div>
            <button onClick={() => setShowSelector(false)} className="w-full mt-8 text-[10px] font-black uppercase text-slate-400">Cerrar</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Centro de Entrenamiento</h1>
        <button 
          onClick={handleTrainNow}
          className="bg-[#1a1f2e] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase italic hover:scale-105 transition-all shadow-xl"
        >
          Entrenar Ahora
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* SIDEBAR */}
        <div className="col-span-3">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#1a1f2e] rounded-[30px] flex items-center justify-center text-white text-4xl font-black mb-6">C</div>
            <h3 className="text-xl font-black uppercase italic">{user?.full_name || 'Carlos Andrade'}</h3>
            
            <div className="w-full mt-8 space-y-4">
               {/* PUNTO 2 RECUPERADO: Cuadro verde de sesiones */}
               <div className="bg-[#10b981] p-6 rounded-[28px] text-white shadow-lg">
                  <p className="text-[9px] font-black uppercase opacity-80 mb-1">Sesiones Full</p>
                  <p className="text-4xl font-black italic">{user?.workout_sessions?.filter((s:any) => s.status === 'full').length || 0}</p>
               </div>
               {/* PUNTO 2 RECUPERADO: Cuadro naranja de sesiones terminadas antes */}
               <div className="bg-[#f59e0b] p-6 rounded-[28px] text-white shadow-lg">
                  <p className="text-[9px] font-black uppercase opacity-80 mb-1">Sesiones Early</p>
                  <p className="text-4xl font-black italic">{user?.workout_sessions?.filter((s:any) => s.status === 'early').length || 0}</p>
               </div>
            </div>
          </div>
        </div>

        {/* METRICAS (PUNTO 3 CORREGIDO) */}
        <div className="col-span-9 space-y-8">
          <div className="grid grid-cols-4 gap-4">
             <MetricCard label="Peso" value="90 kg" status="normal" />
             <MetricCard label="Grasa" value="20%" status="good" />
             <MetricCard label="Músculo" value="35 kg" status="excellent" />
             <MetricCard label="IMC" value="29.4" status="warning" />
          </div>
          {/* ... Resto del calendario ... */}
        </div>
      </div>
    </div>
  );
};

// Componente para las métricas con indicadores de salud
const MetricCard = ({ label, value, status }: any) => {
  const colors: any = {
    good: 'border-emerald-500 text-emerald-600',
    warning: 'border-orange-500 text-orange-600',
    excellent: 'border-blue-500 text-blue-600',
    normal: 'border-slate-100 text-slate-400'
  };
  return (
    <div className={`p-6 bg-white rounded-[35px] border-2 shadow-sm ${colors[status] || 'border-slate-100'}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-2xl font-black italic text-[#1a1f2e]">{value}</p>
    </div>
  );
};

export default ProfileDashboard;