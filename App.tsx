
import React, { useState, useEffect } from 'react';
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
import { WorkoutEngine } from './services/workoutEngine';
import Calendar from './components/Calendar';
import OnboardingForm from './components/OnboardingForm';
import ProfileDashboard from './components/ProfileDashboard';
import WorkoutPlayer from './components/WorkoutPlayer';
// Use named import for LegalDisclaimer to avoid potential module resolution issues
import { LegalDisclaimer } from './components/LegalDisclaimer';

const STORAGE_KEY = 'kurafit_user_data';
const LEGAL_KEY = 'kurafit_legal_accepted';

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Sentadilla con Barra', description: 'Mantén los pies a la anchura de los hombros. Baja la cadera rompiendo el paralelo.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.ADVANCED, equipment: [Equipment.BARBELL], is_compound: true, substitute_id: '7', video_id: 'SW_C1A-rejs' },
  { id: '2', name: 'Prensa de Piernas', description: 'Empuja la plataforma con los talones, evitando bloquear las rodillas.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.MACHINE], is_compound: true, video_id: 'IZxyjW7MPJQ' },
  { id: '3', name: 'Press de Banca', description: 'Baja la barra hasta la parte media del pecho con los codos a 45 grados.', muscle_target: MuscleGroup.CHEST, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: 'rT7DgCr-3pg' },
  { id: '4', name: 'Remo con Barra', description: 'Flexiona ligeramente las rodillas e inclina el torso 45 grados.', muscle_target: MuscleGroup.BACK, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: '9efgcAjQW70' },
  { id: '5', name: 'Press Militar', description: 'De pie, empuja la barra sobre tu cabeza hasta extender los brazos.', muscle_target: MuscleGroup.SHOULDERS, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: '2yjwHeE_uC0' },
  { id: '6', name: 'Plancha Abdominal', description: 'Cuerpo en línea recta, activando glúteos y abdomen.', muscle_target: MuscleGroup.CORE, difficulty: Difficulty.BEGINNER, equipment: [Equipment.BODYWEIGHT], is_compound: false, video_id: 'ASdvN_XEl_c' },
  { id: '7', name: 'Puente de Glúteo', description: 'Eleva la cadera contrayendo los glúteos al máximo.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.BEGINNER, equipment: [Equipment.BODYWEIGHT], is_compound: false, video_id: 'wPM8icPu6H8' },
  { id: '8', name: 'Curl de Bíceps', description: 'Flexiona los brazos llevando las mancuernas hacia los hombros.', muscle_target: MuscleGroup.ARMS, difficulty: Difficulty.BEGINNER, equipment: [Equipment.DUMBBELL], is_compound: false, video_id: 'ykJmrZ5v0Oo' },
  { id: '9', name: 'Zancadas', description: 'Baja la rodilla trasera hasta casi tocar el suelo.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.DUMBBELL], is_compound: true, video_id: 'D7KaRcUTQeE' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'legal' | 'onboarding' | 'dashboard'>('legal');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [showSessionSelector, setShowSessionSelector] = useState(false);

  useEffect(() => {
    const legalAccepted = localStorage.getItem(LEGAL_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.metrics_history) {
          parsed.metrics_history = parsed.metrics_history.map((m: any) => ({
            ...m,
            date: new Date(m.date)
          }));
        }
        if (parsed.session_history) {
          parsed.session_history = parsed.session_history.map((s: any) => ({
            ...s,
            date: new Date(s.date)
          }));
        }
        setUser(parsed);
        setStep('dashboard');
        generatePlan(parsed);
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    } else if (legalAccepted) {
      setStep('onboarding');
    }
  }, []);

  const calculateNutrition = (u: Partial<User>): NutritionPlan => {
    const tmb = (10 * (u.weight_kg || 70)) + (6.25 * (u.height_cm || 170)) - (5 * (u.age || 25)) + 5;
    let multiplier = 1.375;
    if (u.sessions_per_week && u.sessions_per_week >= 4) multiplier = 1.55;
    
    let calories = tmb * multiplier;
    if (u.goal === WorkoutFocus.METABOLIC) calories -= 400;
    if (u.goal === WorkoutFocus.HYPERTROPHY) calories += 300;

    let proteinPct = 0.3, carbPct = 0.4, fatPct = 0.3;
    if (u.diet === DietType.KETO) { proteinPct = 0.25; carbPct = 0.05; fatPct = 0.7; }
    if (u.diet === DietType.VEGAN || u.diet === DietType.VEGETARIAN) { proteinPct = 0.25; carbPct = 0.5; fatPct = 0.25; }
    if (u.diet === DietType.PALEO) { proteinPct = 0.35; carbPct = 0.25; fatPct = 0.4; }

    return {
      calories: Math.round(calories),
      protein_g: Math.round((calories * proteinPct) / 4),
      carbs_g: Math.round((calories * carbPct) / 4),
      fats_g: Math.round((calories * fatPct) / 9),
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
      id: Math.random().toString(36).substr(2, 9),
      metrics_history: [initialMetric], 
      completed_sessions_count: 0, 
      early_finished_count: 0,
      session_history: [],
      nutrition
    };
    setUser(userWithMetrics);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithMetrics));
    await generatePlan(userWithMetrics);
    setLoading(false);
    setStep('dashboard');
  };

  const handleUpdateMetrics = (newMetric: MetricEntry) => {
    if (!user) return;
    const updatedUser = { ...user, weight_kg: newMetric.weight_kg, metrics_history: [newMetric, ...user.metrics_history].slice(0, 30) };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const handleStartToday = () => setShowSessionSelector(true);
  const handleSessionSelect = (session: WorkoutSession) => { setActiveSession(session); setShowSessionSelector(false); };

  const completeSession = (status: SessionCompletionStatus = 'full') => {
    if (plan && activeSession && user) {
      const newSessions = plan.sessions.map(s => s.id === activeSession.id ? { ...s, is_completed: true, date: new Date() } : s);
      setPlan({ ...plan, sessions: newSessions });
      
      const newHistoryRecord: CompletedSessionRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        focus: activeSession.focus,
        status: status
      };

      const updatedUser = { 
        ...user, 
        completed_sessions_count: status === 'full' ? user.completed_sessions_count + 1 : user.completed_sessions_count,
        early_finished_count: status === 'early' ? user.early_finished_count + 1 : user.early_finished_count,
        session_history: [...user.session_history, newHistoryRecord]
      };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
    setActiveSession(null);
  };

  const handleReset = () => {
    const isConfirmed = window.confirm("⚠️ ADVERTENCIA CRÍTICA: Se borrarán todos tus datos biométricos, historial de sesiones y plan personalizado de forma permanente. ¿Estás seguro de que deseas resetear tu perfil por completo?");
    if (isConfirmed) {
      // Limpieza exhaustiva
      localStorage.clear();
      setUser(null);
      setPlan(null);
      setStep('legal');
      // Redirección forzada para limpiar estados en memoria
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">K</div>
             <h1 className="text-xl font-black tracking-tight italic">KURA<span className="text-blue-600">FIT</span></h1>
          </div>
          {step === 'dashboard' && (
            <button onClick={handleStartToday} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">Entrenar Ahora</button>
          )}
        </div>
      </nav>

      <main className={`flex-1 flex flex-col ${step !== 'dashboard' ? 'justify-center items-center p-4 md:p-8 min-h-[calc(100vh-64px)] w-full max-w-4xl mx-auto' : 'max-w-6xl mx-auto p-4 md:p-8 w-full'}`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Sincronizando Sistema IA...</p>
          </div>
        ) : step === 'legal' ? (
          <LegalDisclaimer onAccept={handleLegalAccept} />
        ) : step === 'onboarding' ? (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        ) : (
          <section className="space-y-10 w-full animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Centro de entrenamiento</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Status biomecánico para {user?.full_name.split(' ')[0]}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleReset();
                }} 
                className="text-[10px] font-black text-red-600 bg-red-50 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm active:scale-95"
              >
                Resetear Perfil
              </button>
            </div>

            {user && <ProfileDashboard user={user} onAddMetric={handleUpdateMetrics} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">{plan && <Calendar sessions={plan.sessions} />}</div>
               <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm h-fit">
                  <h3 className="text-sm font-black text-slate-900 uppercase italic mb-6 tracking-tighter">Siguiente Estímulo</h3>
                  {plan?.sessions.find(s => !s.is_completed) ? (
                    <div className="space-y-4">
                      <div className="p-6 bg-slate-900 rounded-[32px] border border-slate-800 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Enfoque de Hoy</p>
                        <p className="text-2xl font-black uppercase italic group-hover:text-blue-500 transition-colors">{plan.sessions.find(s => !s.is_completed)?.focus}</p>
                        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                      </div>
                      <button onClick={() => handleSessionSelect(plan.sessions.find(s => !s.is_completed)!)} className="w-full py-5 bg-blue-600 text-white font-black rounded-[28px] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase italic tracking-widest text-sm active:scale-95">INICIAR SESIÓN</button>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Semana Finalizada</p>
                       <p className="text-xs text-slate-500 font-bold mt-2 italic">¡Buen trabajo, Atleta! Sistema recargado.</p>
                    </div>
                  )}
               </div>
            </div>
          </section>
        )}

        {showSessionSelector && plan && (
          <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-xl font-black text-slate-900 mb-2 uppercase italic">Selector Manual</h2>
              <p className="text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-widest">Ignorar orden cronológico e iniciar sesión específica</p>
              <div className="space-y-3">
                {plan.sessions.map((session, i) => (
                  <button key={session.id} onClick={() => handleSessionSelect(session)} className="w-full flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-[28px] hover:border-blue-500 hover:bg-white transition-all group active:scale-95">
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sesión {i+1}</p>
                      <p className="font-black text-slate-900 uppercase italic group-hover:text-blue-600">{session.focus}</p>
                    </div>
                    {session.is_completed ? <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase">Hecho</span> : <span className="text-[8px] font-black text-slate-300 uppercase">Pendiente</span>}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowSessionSelector(false)} className="w-full mt-6 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600">Cerrar</button>
            </div>
          </div>
        )}

        {activeSession && user && (
          <WorkoutPlayer 
            session={activeSession} 
            userInjuries={user.injuries}
            onClose={() => setActiveSession(null)} 
            onComplete={completeSession} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
