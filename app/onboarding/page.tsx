'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';
import { 
  User, 
  MuscleGroup, 
  Difficulty, 
  Equipment,
  WorkoutFocus,
  WeeklyWorkoutPlan,
  WorkoutSession,
  Exercise
} from './types';

import { WorkoutEngine } from './services/workoutEngine';
import Calendar from './components/Calendar';
import OnboardingForm from './components/OnboardingForm';
import ProfileDashboard from './components/ProfileDashboard';
import WorkoutPlayer from './components/WorkoutPlayer';
import LegalDisclaimer from './components/LegalDisclaimer';

const STORAGE_KEY = 'kurafit_user_data';
const LEGAL_KEY = 'kurafit_legal_accepted';

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Sentadilla con Barra', description: 'Mantén los pies a la anchura de los hombros.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.ADVANCED, equipment: [Equipment.BARBELL], is_compound: true, substitute_id: '7', video_id: 'SW_C1A-rejs' },
  { id: '3', name: 'Press de Banca', description: 'Baja la barra hasta la parte media del pecho.', muscle_target: MuscleGroup.CHEST, difficulty: Difficulty.INTERMEDIATE, equipment: [Equipment.BARBELL], is_compound: true, video_id: 'rT7DgCr-3pg' },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'legal' | 'onboarding' | 'dashboard'>('legal');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser(profile as any);
        setStep('dashboard');
        await generatePlan(profile as any);
      } else {
        const legalAccepted = localStorage.getItem(LEGAL_KEY);
        setStep(legalAccepted ? 'onboarding' : 'legal');
      }
      setLoading(false);
    };
    initApp();
  }, [router]);

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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: userData.full_name,
        goal: userData.goal,
        fitness_level: userData.fitness_level,
        weight: userData.weight_kg,
        height: userData.height_cm,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      setUser(userData);
      await generatePlan(userData);
      setStep('dashboard');
    } catch (e: any) { 
      alert("Error al guardar: " + e.message); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sincronizando...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <nav className="border-b bg-white h-16 flex items-center px-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <h1 className="text-xl font-black italic">KURA<span className="text-blue-600">FIT</span></h1>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {step === 'legal' && <LegalDisclaimer onAccept={handleLegalAccept} />}
        {step === 'onboarding' && <OnboardingForm onComplete={handleOnboardingComplete} />}
        {step === 'dashboard' && user && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase">Tu Dashboard</h2>
            <ProfileDashboard user={user} onAddMetric={() => {}} />
            {plan && <Calendar sessions={plan.sessions} />}
          </div>
        )}
      </main>

      {activeSession && (
        <WorkoutPlayer 
          session={activeSession} 
          userInjuries={user?.injuries || []} 
          onClose={() => setActiveSession(null)} 
          onComplete={() => setActiveSession(null)} 
        />
      )}
    </div>
  );
}