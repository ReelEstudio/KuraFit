'use client';
import React, { useState } from 'react';
import Calendar from './Calendar';
// RUTA CORREGIDA PARA VERCEL
import { User, DietType, WorkoutFocus } from '../types';

const DIET_DETAILS: Record<string, { title: string; desc: string; example: string }> = {
  [DietType.OMNIVORE]: { 
    title: "Dieta Balanceada (Omnívora)",
    desc: "Incluye todos los grupos de alimentos sin restricciones.",
    example: "Pollo a la plancha, arroz integral y brócoli al vapor."
  },
  [DietType.VEGAN]: { 
    title: "Dieta 100% Vegetal (Vegana)",
    desc: "Excluye productos de origen animal.",
    example: "Bowl de quinoa con garbanzos y aguacate."
  },
  [DietType.KETO]: { 
    title: "Dieta Cetogénica (Keto)",
    desc: "Baja en carbohidratos y alta en grasas saludables.",
    example: "Salmón al horno con espárragos y huevo."
  },
  [DietType.PALEO]: { 
    title: "Dieta Paleolítica",
    desc: "Alimentos no procesados, carnes y vegetales.",
    example: "Carne de res magra con vegetales salteados."
  }
};

const ProfileDashboard = ({ user }: { user: any }) => {
  const [showSelector, setShowSelector] = useState(false);

  if (!user || !user.nutrition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-2xl font-black italic animate-pulse text-slate-300 uppercase tracking-widest">KURAFIT ENGINE LOADING...</p>
      </div>
    );
  }

  const diet = DIET_DETAILS[user.diet_type] || DIET_DETAILS[DietType.OMNIVORE];
  const macros = [
    { label: 'PROTEÍNA', val: user.nutrition.protein, max: 200, color: 'bg-emerald-400' },
    { label: 'CARBOS', val: user.nutrition.carbs, max: 300, color: 'bg-blue-400' },
    { label: 'GRASA', val: user.nutrition.fat, max: 100, color: 'bg-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 text-[#1a1f2e]">
      {showSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md p-4">
          <div className="bg-white rounded-[60px] p-12 max-w-lg w-full shadow-2xl border border-slate-100">
            <h2 className="text-4xl font-black italic uppercase text-center mb-8 tracking-tighter">INICIAR SESIÓN</h2>
            <div className="space-y-4">
              {['STRENGTH', 'HYPERTROPHY', 'METABOLIC'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => window.location.href=`/workout?type=${f.toLowerCase()}`}
                  className="w-full p-8 bg-slate-50 rounded-[35px] flex justify-between items-center hover:bg-[#1a1f2e] hover:text-white transition-all group"
                >
                  <span className="text-2xl font-black italic">{f}</span>
                  <span className="text-[10px] font-black opacity-40 uppercase">ENTRENAR →</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSelector(false)} className="w-full mt-10 text-[10px] font-black uppercase text-slate-300">CERRAR</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">NIVEL ATLETA: {user.level || 'ACTIVO'}</p>
            <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85]">KURAFIT<br/>DASHBOARD</h1>
          </div>
          <button onClick={() => setShowSelector(true)} className="bg-[#1a1f2e] text-white px-10 py-5 rounded-[24px] text-[11px] font-black uppercase italic shadow-2xl hover:scale-105 transition-all">ENTRENAR AHORA</button>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-[55px] p-10 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#1a1f2e] rounded-[35px] flex items-center justify-center text-white text-4xl font-black mb-6">{user.full_name?.charAt(0)}</div>
              <h3 className="text-2xl font-black uppercase italic text-center mb-8 leading-tight">{user.full_name}</h3>
              <div className="bg-[#10b981] w-full p-8 rounded-[38px] text-white shadow-lg mb-6 shadow-emerald-100">
                <p className="text-[9px] font-black opacity-70 mb-1 uppercase tracking-widest text-center">SESIONES COMPLETADAS</p>
                <p className="text-5xl font-black italic leading-none text-center">{user.workout_sessions?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-10 rounded-[45px] border-2 border-blue-400 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-300 mb-1 uppercase">PESO</p>
                <p className="text-3xl font-black italic text-[#1a1f2e]">70 kg</p>
              </div>
              <div className="bg-white p-10 rounded-[45px] border-2 border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-300 mb-1 uppercase">NIVEL</p>
                <p className="text-3xl font-black italic text-[#1a1f2e] uppercase">{user.level}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-8 bg-white rounded-[65px] p-14 shadow-xl shadow-slate-200/50 border border-slate-50">
                <h3 className="text-2xl font-black uppercase italic mb-10 text-center">CALENDARIO DE ADHERENCIA</h3>
                <Calendar sessions={user.workout_sessions || []} />
              </div>

              <div className="col-span-12 md:col-span-4 bg-white rounded-[50px] p-10 shadow-xl border border-slate-100 flex flex-col">
                <p className="text-[9px] font-black text-slate-400 mb-6 uppercase tracking-widest">PLAN NUTRICIONAL IA</p>
                <div className="bg-emerald-50 p-6 rounded-[35px] mb-8 border border-emerald-100">
                  <p className="text-xl font-black text-emerald-900 italic uppercase leading-tight">{diet.title}</p>
                </div>
                <div className="space-y-6">
                  {macros.map(m => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black tracking-widest uppercase"><span>{m.label}</span><span>{m.val}g</span></div>
                      <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div className={`h-full ${m.color}`} style={{width: `${Math.min((m.val/m.max)*100, 100)}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 italic text-center mt-10">"{diet.example}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;