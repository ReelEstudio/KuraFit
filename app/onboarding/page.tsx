'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';
// Ajustamos la ruta para que busque 'types.ts' que está en la raíz de 'app'
import { 
  User, 
  MuscleGroup, 
  Difficulty, 
  Equipment,
  WorkoutFocus,
  WeeklyWorkoutPlan,
  WorkoutSession,
  Exercise
} from '../types'; 

// Ajustamos las rutas de componentes y services
import { WorkoutEngine } from '../services/workoutEngine';
import Calendar from '../components/Calendar';
import OnboardingForm from '../components/OnboardingForm';
import ProfileDashboard from '../components/ProfileDashboard';
import WorkoutPlayer from '../components/WorkoutPlayer';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function OnboardingPage() {
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
      }
      setLoading(false);
    };
    initApp();
  }, [router]);

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
      setStep('dashboard');
    } catch (e: any) { 
      alert("Error: " + e.message); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      {step === 'legal' && <LegalDisclaimer onAccept={() => setStep('onboarding')} />}
      {step === 'onboarding' && <OnboardingForm onComplete={handleOnboardingComplete} />}
      {step === 'dashboard' && user && (
        <div className="space-y-6">
          <ProfileDashboard user={user} onAddMetric={() => {}} />
        </div>
      )}
    </main>
  );
}