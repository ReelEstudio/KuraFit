'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { WorkoutSession, SessionCompletionStatus } from '../types';

interface WorkoutPlayerProps {
  session: WorkoutSession;
  onComplete: (status: SessionCompletionStatus) => void;
  onExit: () => void;
}

const WorkoutPlayer = ({ session, onComplete, onExit }: WorkoutPlayerProps) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [issaving, setIsSaving] = useState(false);

  const finishWorkout = async (status: SessionCompletionStatus) => {
    setIsSaving(true);
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) return;

      // Guardamos la sesión en la tabla workout_sessions
      const { error } = await supabase.from('workout_sessions').insert({
        user_id: authSession.user.id,
        focus: session.focus,
        status: status,
        exercises: session.exercises, // Aquí se guarda la rutina de la IA
        date: new Date().toISOString()
      });

      if (error) throw error;
      
      onComplete(status); // Esto avisará al dashboard para refrescar
    } catch (e) {
      console.error("Error al guardar sesión:", e);
      alert("Error al guardar el entrenamiento.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-[200] overflow-y-auto p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => setShowExitModal(true)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            SALIR
          </button>
          <div className="text-right">
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">SESIÓN ACTIVA</p>
            <h1 className="text-2xl font-black italic uppercase text-slate-900">{session.focus}</h1>
          </div>
        </div>

        {/* LISTA DE EJERCICIOS GENERADOS POR LA IA */}
        <div className="space-y-6 mb-12">
          {session.exercises.map((ex, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase mb-1">EJERCICIO {idx + 1}</p>
                <h3 className="text-xl font-black italic uppercase text-slate-900">{ex.name}</h3>
                <p className="text-xs font-bold text-blue-500 uppercase">{ex.muscle_target}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black italic text-slate-900">
                  {ex.sets.length} <span className="text-[10px] uppercase not-italic opacity-30">Series</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <button 
          disabled={issaving}
          onClick={() => finishWorkout(SessionCompletionStatus.FULL)}
          className="w-full py-8 bg-[#1a1f2e] text-white rounded-[35px] font-black italic uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50"
        >
          {issaving ? 'GUARDANDO...' : 'FINALIZAR ENTRENAMIENTO →'}
        </button>

        {showExitModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[210] flex items-center justify-center p-6">
            <div className="bg-white rounded-[50px] p-12 max-w-sm w-full shadow-2xl text-center">
              <h3 className="text-3xl font-black italic uppercase mb-8">¿ABANDONAR?</h3>
              <div className="space-y-3">
                <button onClick={() => finishWorkout(SessionCompletionStatus.EARLY)} className="w-full py-5 bg-orange-600 text-white font-black rounded-3xl uppercase italic text-xs">TERMINAR AHORA</button>
                <button onClick={() => setShowExitModal(false)} className="w-full py-5 bg-slate-100 text-slate-400 font-black rounded-3xl text-[10px]">VOLVER</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;