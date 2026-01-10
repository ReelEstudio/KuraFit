'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, 
  Exercise, 
  Difficulty, 
  Equipment, 
  MuscleGroup, 
  WeeklyWorkoutPlan,
  WorkoutFocus,
  WorkoutSession,
  MetricEntry,
  CompletedSessionRecord,
  SessionCompletionStatus,
  DietType,
  NutritionPlan
} from './types';

// AJUSTE DE RUTAS: Aseguramos que apunten a las carpetas dentro de 'app'
import { WorkoutEngine } from './services/workoutEngine';
import Calendar from './components/Calendar';
import OnboardingForm from './components/OnboardingForm';
import ProfileDashboard from './components/ProfileDashboard';
import WorkoutPlayer from './components/WorkoutPlayer';
import LegalDisclaimer from './components/LegalDisclaimer';

// Inicialización de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const STORAGE_KEY = 'kurafit_user_data';
const LEGAL_KEY = 'kurafit_legal_accepted';

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Sentadilla con Barra', description: 'Mantén los pies a la anchura de los hombros.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.ADVANCED, equipment: [Equipment.BARBELL], is_compound: true, substitute_id: '7', video_id: 'SW_C1A-rejs' },
  { id: '2', name: 'Prensa de Piernas', description: 'Empuja la plataforma con los talones.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.MACHINE], is_compound: true, video_id: 'IZxyjW7MPJQ' },
  { id: '3', name: 'Press de Banca', description: 'Baja la barra hasta la parte media del pecho.', muscle_target: MuscleGroup.CHEST, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: 'rT7DgCr-3pg' },
  { id: '4', name: 'Remo con Barra', description: 'Inclina el torso 45 grados.', muscle_target: MuscleGroup.BACK, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: '9efgcAjQW70' },
  { id: '5', name: 'Press Militar', description: 'Empuja la barra sobre tu cabeza.', muscle_target: MuscleGroup.SHOULDERS, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: '2yjwHeE_uC0' },
  { id: '6', name: 'Plancha Abdominal', description: 'Cuerpo en línea recta.', muscle_target: MuscleGroup.CORE, difficulty: Difficulty.BEGINNER, equipment: [Equipment.BODYWEIGHT], is_compound: false, video_id: 'ASdvN_XEl_c' },
  { id: '7', name: 'Puente de Glúteo', description: 'Eleva la cadera contrayendo los glúteos.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.BEGINNER, equipment: [Equipment.BODYWEIGHT], is_compound: false, video_id: 'wPM8icPu6H8' },
  { id: '8', name: 'Curl de Bíceps', description: 'Flexiona los brazos.', muscle_target: MuscleGroup.ARMS, difficulty: Difficulty.BEGINNER, equipment: [Equipment.DUMBBELL], is_compound: false, video_id: 'ykJmrZ5v0Oo' },
  { id: '9', name: 'Zancadas', description: 'Baja la rodilla trasera.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.DUMBBELL], is_compound: true, video_id: 'D7KaRcUTQeE' },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'legal' | 'onboarding' | 'dashboard'>('legal');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [showSessionSelector, setShowSessionSelector] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const legalAccepted = localStorage.getItem(LEGAL_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setStep('dashboard');
          await generatePlan(parsed);
        } catch (e) {
          console.error("Error loading saved data", e);
        }
      } else if (legalAccepted) {
        setStep('onboarding');
      }
      setLoading(false);
    };
    initApp();
  }, []);

  const calculateNutrition = (u: Partial<User>): NutritionPlan => {
    const tmb = (10 * (u.weight_kg || 70)) + (6.25 * (u.height_cm || 170)) - (5 * (u.age || 25)) + 5;
    let multiplier = (u.sessions_per_week || 3) >= 4 ? 1.55 : 1.375;
    let calories = tmb * multiplier;
    if (u.goal === WorkoutFocus.METABOLIC) calories -= 400;
    if (u.goal === WorkoutFocus.HYPERTROPHY) calories += 300;

    return {
      calories: Math.round(calories),
      protein_g: Math.round((calories * 0.3) / 4),
      carbs_g: Math.round((calories * 0.4) / 4),
      fats_g: Math.round((calories * 0.3) / 9),
      key_micros: ['Magnesio', 'Zinc', 'Vitamina D3']
    };
  };

  const generatePlan = async (userData: User) => {
    const engine = new WorkoutEngine();
    const newPlan = await engine.generateWeeklyPlan(userData, MOCK_EXERCISES);
    setPlan(newPlan);
  };

  const handleLegalAccept = () => {
    localStorage.setItem(LEGAL_KEY, 'true');
    setStep('onboarding');
  };

  const handleOnboardingComplete = async (userData: User) => {
    setLoading(true);
    const nutrition = calculateNutrition(userData);
    const initialMetric: MetricEntry = {
      date: new Date(),
      weight_kg: userData.weight_kg,
      body_fat_pct: 20,
      muscle_mass_kg: Math.round(userData.weight_kg * 0.4)
    };
    const userWithMetrics: User = { 
      ...userData, 
      id: crypto.randomUUID(),
      metrics_history: [initialMetric], 
      completed_sessions_count: 0, 
      early_finished_count: 0,
      session_history: [],
      nutrition
    };
    
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from('profiles').upsert(userWithMetrics);
      }
    } catch (e) { console.warn("Supabase not connected, using localStorage"); }

    setUser(userWithMetrics);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithMetrics));
    await generatePlan(userWithMetrics);
    setLoading(false);
    setStep('dashboard');
  };

  const handleReset = () => {
    if (window.confirm("⚠️ ¿Resetear perfil por completo?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Sincronizando Sistema IA...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">K</div>
             <h1 className="text-xl font-black tracking-tight italic">KURA<span className="text-blue-600">FIT</span></h1>
          </div>
          {step === 'dashboard' && (
            <button onClick={() => setShowSessionSelector(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all active:scale-95">Entrenar Ahora</button>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-6xl mx-auto p-4 md:p-8 w-full">
        {step === 'legal' && <LegalDisclaimer onAccept={handleLegalAccept} />}
        {step === 'onboarding' && <OnboardingForm onComplete={handleOnboardingComplete} />}
        {step === 'dashboard' && user && (
          <section className="space-y-10 w-full animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase italic leading-none">Dashboard</h2>
                <p className="text-slate-400 text-sm font-medium">Status para {user.full_name}</p>
              </div>
              <button onClick={handleReset} className="text-[10px] font-black text-red-600 bg-red-50 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Resetear Perfil</button>
            </div>

            <ProfileDashboard user={user} onAddMetric={(m) => {
              const updated = { ...user, metrics_history: [m, ...user.metrics_history] };
              setUser(updated);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">{plan && <Calendar sessions={plan.sessions} />}</div>
               <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm h-fit">
                  <h3 className="text-sm font-black uppercase italic mb-6">Próximo Entrenamiento</h3>
                  {plan?.sessions.find(s => !s.is_completed) ? (
                    <button 
                      onClick={() => setActiveSession(plan.sessions.find(s => !s.is_completed)!)}
                      className="w-full py-5 bg-blue-600 text-white font-black rounded-[28px] shadow-xl hover:bg-blue-700 transition-all uppercase italic tracking-widest text-sm"
                    >
                      INICIAR: {plan.sessions.find(s => !s.is_completed)?.focus}
                    </button>
                  ) : (
                    <p className="text-center text-slate-400 font-bold italic py-10">¡Semana completada!</p>
                  )}
               </div>
            </div>
          </section>
        )}

        {activeSession && user && (
          <WorkoutPlayer 
            session={activeSession} 
            userInjuries={user.injuries}
            onClose={() => setActiveSession(null)} 
            onComplete={(status) => {
              setActiveSession(null);
            }} 
          />
        )}
      </main>
    </div>
  );
}
