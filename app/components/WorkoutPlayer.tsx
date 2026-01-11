'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkoutSession, WorkoutExercise, WorkoutSet, ProtocolStep, Injury, SessionCompletionStatus } from '../types';

interface WorkoutPlayerProps {
  session: WorkoutSession;
  userInjuries: Injury[];
  onClose: () => void;
  onComplete: (status: SessionCompletionStatus) => void;
}

const SuccessBurst: React.FC = () => (
  <div className="absolute -top-4 -right-4 w-full h-full pointer-events-none overflow-visible">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i}
        className="absolute bg-emerald-500 rounded-full animate-ping"
        style={{
          width: '8px',
          height: '8px',
          left: '50%',
          top: '50%',
          animationDelay: `${i * 0.1}s`,
          transform: `rotate(${i * 60}deg) translateY(-20px)`
        }}
      />
    ))}
  </div>
);

const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ session, userInjuries, onClose, onComplete }) => {
  const [activeTab, setActiveTab] = useState<'warmup' | 'main' | 'cardio' | 'cooldown'>('warmup');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, boolean[]>>({});
  const [warmupProgress, setWarmupProgress] = useState<boolean[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCompletedSet, setLastCompletedSet] = useState<{exId: string, index: number} | null>(null);

  useEffect(() => {
    const progress: Record<string, boolean[]> = {};
    session.exercises.forEach(ex => {
      progress[ex.id] = ex.sets.map(s => s.completed);
    });
    setExerciseProgress(progress);
    setWarmupProgress(session.warmup.map(w => !!w.completed));
  }, [session]);

  const playSound = useCallback((type: 'set' | 'exercise' | 'warmup' | 'victory') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'victory') {
        osc.type = 'sine';
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.1));
        });
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        return;
      }

      if (type === 'set' || type === 'warmup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        osc.type = 'triangle';
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.05));
        });
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio feedback failed");
    }
  }, []);

  const toggleSet = (exId: string, setIndex: number) => {
    const currentSets = [...(exerciseProgress[exId] || [])];
    const newState = !currentSets[setIndex];
    currentSets[setIndex] = newState;
    
    setExerciseProgress(prev => ({ ...prev, [exId]: currentSets }));
    
    if (newState) {
      setLastCompletedSet({ exId, index: setIndex });
      setTimeout(() => setLastCompletedSet(null), 400); 
      
      const allDone = currentSets.every(s => s);
      playSound(allDone ? 'exercise' : 'set');
    }
  };

  const toggleWarmupStep = (index: number) => {
    const next = [...warmupProgress];
    next[index] = !next[index];
    setWarmupProgress(next);
    if (next[index]) playSound('warmup');
  };

  const handleFinalCompletion = () => {
    playSound('victory');
    setShowSuccessModal(true);
  };

  const currentExercise = useMemo(() => session.exercises[currentExIndex], [session, currentExIndex]);

  const currentCareAlert = useMemo(() => {
    if (!currentExercise || userInjuries.length === 0) return null;
    const target = currentExercise.muscle_target.toLowerCase();
    const specificAdvice: string[] = [];
    userInjuries.forEach(injury => {
      const injuryName = injury.name.toLowerCase();
      if (injuryName.includes('rodilla') && (target === 'legs')) {
        specificAdvice.push(`⚠️ Rodilla: Evita bloqueo articular al extender.`);
      }
      if (injuryName.includes('hombro') && (target === 'chest' || target === 'shoulders' || target === 'back')) {
        specificAdvice.push(`⚠️ Hombro: Mantén escápulas retraídas y codos a 45° con el torso.`);
      }
      if (injuryName.includes('espalda') || injuryName.includes('lumbar')) {
         specificAdvice.push(`⚠️ Lumbar: Mantén abdomen rígido y evita arquear la espalda.`);
      }
    });
    return specificAdvice.length > 0 ? specificAdvice : null;
  }, [currentExercise, userInjuries]);

  const shareWorkout = (platform: 'twitter' | 'whatsapp') => {
    const text = `¡Acabo de completar mi sesión de ${session.focus} en KuraFit! 🚀`;
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const VideoEmbed = ({ videoId }: { videoId?: string }) => {
  if (!videoId) return (
    <div className="w-full aspect-video rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Media no disponible</p>
    </div>
  );
  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl border border-slate-100 bg-black">
      <iframe 
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&autoplay=0`}
        title="Instrucción de ejercicio"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

  const renderWarmup = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-900 uppercase mb-2 italic tracking-tight">Activación Metabólica</h2>
      {session.warmup.map((step, i) => (
        <div key={i} className={`bg-white p-6 rounded-3xl border-2 transition-all ${warmupProgress[i] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
          <div className="flex justify-between items-start mb-4">
             <div className="flex gap-4 items-center">
                <button onClick={() => toggleWarmupStep(i)} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${warmupProgress[i] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {warmupProgress[i] ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg> : <span className="font-black text-xs">0{i+1}</span>}
                </button>
                <h3 className={`font-black uppercase text-sm ${warmupProgress[i] ? 'text-emerald-900' : 'text-slate-900'}`}>{step.name}</h3>
             </div>
          </div>
          <VideoEmbed videoId={step.video_id} />
        </div>
      ))}
      <button onClick={() => setActiveTab('main')} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl transition-all uppercase italic tracking-widest">COMENZAR PARTE PRINCIPAL</button>
    </div>
  );

  const renderMain = () => {
    const exercise = currentExercise;
    const setsStatus = exerciseProgress[exercise.id] || [];
    const exerciseCompleted = setsStatus.length > 0 && setsStatus.every(s => s);

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className={`bg-white p-8 rounded-[40px] border-2 transition-all duration-500 ${exerciseCompleted ? 'border-emerald-500 shadow-2xl' : 'border-slate-100 shadow-xl'}`}>
          <div className="relative mb-6">
            {exerciseCompleted && <SuccessBurst />}
            <h2 className={`text-3xl font-black transition-all ${exerciseCompleted ? 'text-emerald-600' : 'text-slate-900 uppercase italic'}`}>{exercise.name}</h2>
            {currentCareAlert && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-1 animate-pulse">
                {currentCareAlert.map((advice, i) => (
                  <p key={i} className="text-[10px] font-black text-orange-700 uppercase italic">{advice}</p>
                ))}
              </div>
            )}
          </div>
          <VideoEmbed videoId={exercise.video_id} />
          <div className="space-y-3">
            {exercise.sets.map((set, i) => {
               const isDone = exerciseProgress[exercise.id]?.[i];
               const isFlashing = lastCompletedSet?.exId === exercise.id && lastCompletedSet?.index === i;
               return (
                  <button 
                    key={i} 
                    onClick={() => toggleSet(exercise.id, i)} 
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isFlashing ? 'animate-pulse bg-emerald-100' : ''} ${isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-50 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${isDone ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-100'}`}>{i + 1}</div>
                      <span className={`font-black uppercase italic ${isDone ? 'text-emerald-900' : 'text-slate-900'}`}>{set.reps} Reps</span>
                    </div>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white scale-110' : 'bg-white border-slate-200 scale-100'}`}>
                      {isDone && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
               );
            })}
          </div>
        </div>
        <div className="flex gap-4">
          <button disabled={currentExIndex === 0} onClick={() => setCurrentExIndex(c => c - 1)} className="flex-1 py-5 bg-white border-2 border-slate-100 font-black rounded-3xl disabled:opacity-30 uppercase tracking-widest text-[10px]">ANTERIOR</button>
          {currentExIndex < session.exercises.length - 1 ? (
            <button onClick={() => setCurrentExIndex(c => c + 1)} className="flex-[2] py-5 bg-slate-900 text-white font-black rounded-3xl uppercase tracking-widest text-[10px]">SIGUIENTE EJERCICIO</button>
          ) : (
            <button onClick={() => setActiveTab('cardio')} className="flex-[2] py-5 bg-emerald-600 text-white font-black rounded-3xl uppercase tracking-widest text-[10px]">CONTINUAR AL CARDIO</button>
          )}
        </div>
      </div>
    );
  };

  const renderCardio = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-8 text-center">{session.cardio_finisher?.name}</h2>
        <VideoEmbed videoId={session.cardio_finisher?.video_id} />
        <p className="text-slate-700 text-center font-medium italic text-sm leading-relaxed">{session.cardio_finisher?.description}</p>
      </div>
      <button onClick={() => setActiveTab('cooldown')} className="w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl uppercase italic tracking-widest">INICIAR VUELTA A LA CALMA</button>
    </div>
  );

  const renderCooldown = () => (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight px-1">Recuperación Consciente</h2>
      {session.cooldown.map((step, i) => (
        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
          <h3 className="font-black text-slate-900 uppercase text-lg mb-4">{step.name}</h3>
          <VideoEmbed videoId={step.video_id} />
          <p className="text-slate-600 text-xs font-medium italic">{step.description}</p>
        </div>
      ))}
      <button onClick={handleFinalCompletion} className="w-full mt-4 py-6 bg-blue-600 text-white font-black rounded-3xl shadow-2xl uppercase italic tracking-widest">FINALIZAR SESIÓN</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col md:p-6 overflow-hidden">
      <header className="p-6 md:mb-6 md:rounded-[32px] md:shadow-sm border-b border-slate-100 bg-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-100">K</div>
          <div>
            <h1 className="text-sm font-black text-slate-900 italic uppercase leading-none">KURA FIT SESSION</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{activeTab}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExitModal(true)} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">Terminar Antes</button>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 md:py-0 custom-scrollbar">
        <div className="max-w-xl mx-auto pb-20">
          {activeTab === 'warmup' && renderWarmup()}
          {activeTab === 'main' && renderMain()}
          {activeTab === 'cardio' && renderCardio()}
          {activeTab === 'cooldown' && renderCooldown()}
        </div>
      </div>

      {showExitModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white max-w-sm w-full rounded-[40px] p-8 shadow-2xl transform animate-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-900 text-center uppercase mb-2 italic">¿Terminar Sesión?</h3>
            <p className="text-[10px] text-slate-400 text-center font-bold mb-8 uppercase tracking-widest">Se guardará como "Finalización Temprana" en tu historial.</p>
            <div className="space-y-3">
              <button onClick={() => onComplete('early')} className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl uppercase italic text-xs tracking-widest shadow-xl shadow-orange-100">Terminar Ahora</button>
              <button onClick={() => setShowExitModal(false)} className="w-full py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] tracking-widest">Seguir Entrenando</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[300] bg-blue-900/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-700">
          <div className="bg-white max-w-md w-full rounded-[50px] p-10 shadow-2xl text-center transform animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-2 tracking-tighter">¡LEGENDARIO!</h2>
            <p className="text-slate-500 font-bold mb-8 italic uppercase text-xs tracking-widest">Sesión completada al 100%</p>
            
            <div className="flex gap-4 mb-8">
               <button onClick={() => shareWorkout('twitter')} className="flex-1 p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest">Twitter</span>
               </button>
               <button onClick={() => shareWorkout('whatsapp')} className="flex-1 p-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
               </button>
            </div>

            <button onClick={() => onComplete('full')} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl hover:bg-blue-700 transition-all uppercase tracking-widest italic text-sm">VOLVER AL PANEL</button>
          </div>
        </div>
      )}

      <nav className="p-6 bg-white border-t md:border-t-0 md:bg-transparent border-slate-100 grid grid-cols-4 gap-3 max-w-xl mx-auto w-full sticky bottom-0">
        {['warmup', 'main', 'cardio', 'cooldown'].map((t) => (
          <div key={t} className="space-y-1.5 cursor-pointer" onClick={() => setActiveTab(t as any)}>
             <div className={`h-1.5 rounded-full transition-all duration-500 ${ (activeTab === t || (activeTab === 'main' && t === 'warmup') || (activeTab === 'cardio' && ['warmup', 'main'].includes(t)) || (activeTab === 'cooldown')) ? 'bg-blue-600 shadow-sm shadow-blue-100' : 'bg-slate-200'}`} />
             <span className={`text-[8px] font-black uppercase text-center block ${activeTab === t ? 'text-blue-600' : 'text-slate-300'}`}>{t}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default WorkoutPlayer;