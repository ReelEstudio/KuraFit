'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';
import { User, Difficulty, WorkoutFocus, DietType } from '../types'; 

import OnboardingForm from '../components/OnboardingForm';
import ProfileDashboard from '../components/ProfileDashboard';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'legal' | 'onboarding' | 'dashboard'>('legal');
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      try {
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
          // BLINDAJE TOTAL: Mapeo manual para asegurar que no haya nulos
          const fullUser: any = {
            ...profile,
            email: session.user.email,
            full_name: profile.full_name || 'Atleta',
            weight_kg: profile.weight || profile.weight_kg || 70,
            height_cm: profile.height || profile.height_cm || 175,
            age: profile.age || 30,
            gender: profile.gender || 'other',
            fitness_level: profile.fitness_level || Difficulty.BEGINNER,
            goal: profile.goal || WorkoutFocus.HYPERTROPHY,
            diet: profile.diet || DietType.OMNIVORE,
            stress_level: profile.stress_level || 3,
            sleep_quality: profile.sleep_quality || 3,
            injuries: Array.isArray(profile.injuries) ? profile.injuries : [],
            metrics_history: Array.isArray(profile.metrics_history) ? profile.metrics_history : [],
            completed_sessions_count: profile.completed_sessions_count || 0,
            early_finished_count: profile.early_finished_count || 0,
            nutrition: profile.nutrition || null
          };
          
          setUser(fullUser);
          setStep('dashboard');
        } else {
          setStep('legal');
        }
      } catch (err) {
        console.error("Error inicializando:", err);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, [router]);

  const handleOnboardingComplete = async (userData: User) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Aseguramos que guardamos con los nombres de columna correctos de tu DB
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: userData.full_name,
        goal: userData.goal,
        fitness_level: userData.fitness_level,
        weight: userData.weight_kg, // Usamos 'weight' si así está en tu DB
        height: userData.height_cm,
        diet: userData.diet,
        age: userData.age,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      window.location.reload(); // Recarga limpia para evitar errores de estado
    } catch (e: any) { 
      alert("Error al guardar: " + e.message); 
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center animate-pulse">
        <p className="font-black uppercase italic text-slate-900">Cargando Sistema...</p>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto p-4">
      {step === 'legal' && <LegalDisclaimer onAccept={() => setStep('onboarding')} />}
      {step === 'onboarding' && <OnboardingForm onComplete={handleOnboardingComplete} />}
      {step === 'dashboard' && user && <ProfileDashboard user={user} onAddMetric={() => {}} />}
    </main>
  );
}