'use client';
import React, { useState } from 'react';
import { 
  WorkoutSession, 
  SessionCompletionStatus
} from '../types';

interface WorkoutPlayerProps {
  session: WorkoutSession;
  onComplete: (status: SessionCompletionStatus) => void;
  onExit: () => void;
}

const WorkoutPlayer = ({ session, onComplete, onExit }: WorkoutPlayerProps) => {
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-50 overflow-y-auto p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => setShowExitModal(true)} 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
          >
            SALIR DE SESIÓN
          </button>
          <div className="text-right">
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">ENTRENAMIENTO</p>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{session.focus}</h1>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[50px] shadow-xl border border-slate-100 text-center">
          <h2 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">
            Sesión Preparada
          </h2>
          <p className="text-slate-500 mb-10 font-medium">Haz clic abajo para completar esta prueba de sistema.</p>
          
          <button 
            onClick={() => onComplete(SessionCompletionStatus.FULL)}
            className="w-full py-8 bg-[#1a1f2e] text-white rounded-[35px] font-black italic uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl"
          >
            Finalizar Entrenamiento →
          </button>
        </div>

        {showExitModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <div className="bg-white rounded-[50px] p-12 max-w-sm w-full shadow-2xl text-center">
              <h3 className="text-3xl font-black italic uppercase mb-4">¿Terminar ahora?</h3>
              <p className="text-xs text-slate-400 mb-8 font-bold uppercase tracking-widest leading-relaxed">
                Se guardará como &quot;Finalización Temprana&quot; en tu historial.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => onComplete(SessionCompletionStatus.EARLY)}
                  className="w-full py-5 bg-orange-600 text-white font-black rounded-3xl uppercase italic text-xs tracking-widest"
                >
                  Terminar Ahora
                </button>
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="w-full py-5 bg-slate-100 text-slate-400 font-black rounded-3xl text-[10px] tracking-widest"
                >
                  Seguir Entrenando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;