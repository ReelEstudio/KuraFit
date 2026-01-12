'use client';
import React, { useState } from 'react';
import Calendar from './Calendar';
import { User, DietType } from '../types';

interface ProfileDashboardProps {
  user: User;
  onAddMetric?: (metric: any) => Promise<void>;
}

const ProfileDashboard = ({ user, onAddMetric }: ProfileDashboardProps) => {
  const [showSelector, setShowSelector] = useState(false);

  if (!user || !user.nutrition) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 text-[#1a1f2e]">
      {/* Selector de Entrenamiento */}
      {showSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md p-4">
          <div className="bg-white rounded-[60px] p-12 max-w-lg w-full shadow-2xl border border-slate-100">
            <h2 className="text-4xl font-black italic uppercase text-center mb-8 text-slate-900">ENTRENAR</h2>
            <div className="space-y-4">
              {['STRENGTH', 'HYPERTROPHY', 'METABOLIC'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => window.location.href=`/workout?type=${f.toLowerCase()}`}
                  className="w-full p-8 bg-slate-50 rounded-[35px] flex justify-between items-center hover:bg-[#1a1f2e] hover:text-white transition-all group"
                >
                  <span className="text-2xl font-black italic">{f}</span>
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">INICIAR →</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSelector(false)} className="w-full mt-10 text-[10px] font-black uppercase text-slate-300 hover:text-slate-500">CERRAR</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">NIVEL: {user.level}</p>
            <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] text-slate-900">KURAFIT<br/>DASHBOARD</h1>
          </div>
          <button 
            onClick={() => setShowSelector(true)} 
            className="bg-[#1a1f2e] text-white px-10 py-5 rounded-[24px] text-[11px] font-black uppercase italic shadow-2xl hover:scale-105 transition-all"
          >
            ENTRENAR AHORA
          </button>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-[55px] p-10 shadow-xl border border-slate-50 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#1a1f2e] rounded-[35px] flex items-center justify-center text-white text-4xl font-black mb-6">
                {user.full_name?.charAt(0)}
              </div>
              <h3 className="text-2xl font-black uppercase italic text-center mb-8 text-slate-900">{user.full_name}</h3>
              <div className="bg-[#10b981] w-full p-8 rounded-[38px] text-white shadow-lg text-center">
                <p className="text-[9px] font-black opacity-70 mb-1 uppercase tracking-widest">SESIONES</p>
                <p className="text-5xl font-black italic leading-none">{user.workout_sessions?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-10 rounded-[45px] border-2 border-blue-400 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-300 mb-1 uppercase tracking-widest">OBJETIVO</p>
                <p className="text-2xl font-black italic text-[#1a1f2e] uppercase">{user.goal}</p>
              </div>
              <div className="bg-white p-10 rounded-[45px] border-2 border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-300 mb-1 uppercase tracking-widest">CALORÍAS</p>
                <p className="text-3xl font-black italic text-[#1a1f2e]">{user.nutrition.calories}</p>
              </div>
              <div className="bg-white p-10 rounded-[45px] border-2 border-orange-500 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-300 mb-1 uppercase tracking-widest">DIETA</p>
                <p className="text-2xl font-black italic text-[#1a1f2e] uppercase">{user.diet_type}</p>
              </div>
            </div>

            <div className="bg-white rounded-[65px] p-12 shadow-xl border border-slate-50">
              <h3 className="text-2xl font-black uppercase italic mb-10 text-center tracking-tight text-slate-900">HISTORIAL DE ACTIVIDAD</h3>
              <Calendar sessions={user.workout_sessions || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;