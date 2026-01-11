'use client';
import React, { useState } from 'react';
import Calendar from './Calendar';

const ProfileDashboard = ({ user }: any) => {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-[#1a1f2e]">
            CENTRO DE ENTRENAMIENTO
          </h1>
          <button 
            onClick={() => setShowSelector(true)}
            className="bg-[#1a1f2e] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-lg active:scale-95 transition-all"
          >
            ENTRENAR AHORA
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* PERFIL (IZQUIERDA) */}
          <div className="col-span-3 space-y-6">
            <div className="bg-white rounded-[60px] p-12 shadow-xl shadow-slate-200/60 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#1a1f2e] rounded-[35px] flex items-center justify-center text-white text-4xl font-black mb-8">
                C
              </div>
              <h3 className="text-2xl font-black uppercase italic leading-tight mb-12">
                CARLOS<br/>ANDRADE
              </h3>
              
              <div className="bg-[#10b981] w-full p-8 rounded-[40px] text-white text-left shadow-lg shadow-emerald-100">
                <p className="text-[8px] font-black uppercase opacity-80 mb-1">SESIONES FULL</p>
                <p className="text-5xl font-black italic">0</p>
              </div>
              
              {/* SESIONES EARLY (Naranja) */}
              <div className="bg-[#f59e0b] w-full p-8 rounded-[40px] text-white text-left shadow-lg shadow-orange-100 mt-4">
                <p className="text-[8px] font-black uppercase opacity-80 mb-1">SESIONES EARLY</p>
                <p className="text-5xl font-black italic">0</p>
              </div>
            </div>
          </div>

          {/* CUERPO CENTRAL */}
          <div className="col-span-9 space-y-8">
            {/* MÉTRICAS SUPERIORES */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard label="PESO" value="90 kg" borderColor="border-blue-400" />
              <MetricCard label="GRASA" value="20%" borderColor="border-slate-100" />
              <MetricCard label="MÚSCULO" value="35 kg" borderColor="border-slate-100" />
              <MetricCard label="IMC" value="29.4" borderColor="border-slate-100" />
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* CALENDARIO */}
              <div className="col-span-8 bg-white rounded-[70px] p-16 shadow-xl shadow-slate-200/60">
                <h3 className="text-3xl font-black uppercase italic mb-12 text-center">CALENDARIO SEMANAL</h3>
                <Calendar sessions={[]} />
              </div>

              {/* LATERAL DERECHO */}
              <div className="col-span-4 space-y-6">
                <div className="bg-[#1a1f2e] rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden">
                  <p className="text-[8px] font-black uppercase text-blue-400 mb-2 tracking-widest">SIGUIENTE ESTÍMULO</p>
                  <h4 className="text-4xl font-black italic uppercase leading-none mb-8">STRENGTH<br/>& FORCE</h4>
                  <button onClick={() => window.location.href='/workout?type=strength'} className="w-full bg-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase italic shadow-lg shadow-blue-900/20">
                    INICIAR SESIÓN
                  </button>
                </div>

                <div className="bg-white rounded-[50px] p-10 shadow-xl shadow-slate-200/60 text-center border border-slate-50">
                  <p className="text-[8px] font-black uppercase text-slate-300 mb-6 tracking-widest">PLAN NUTRICIONAL IA</p>
                  <div className="bg-emerald-50/50 p-6 rounded-[30px] border border-emerald-100">
                    <p className="text-xl font-black text-emerald-600 italic uppercase">DÉFICIT CALÓRICO ACTIVO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, borderColor }: any) => (
  <div className={`bg-white p-10 rounded-[45px] border-2 shadow-xl shadow-slate-200/40 transition-all hover:scale-105 ${borderColor}`}>
    <p className="text-[9px] font-black uppercase text-slate-300 mb-1 tracking-widest">{label}</p>
    <p className="text-3xl font-black italic text-[#1a1f2e]">{value}</p>
  </div>
);

export default ProfileDashboard;