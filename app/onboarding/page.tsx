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
          // Mapeo manual para asegurar que no haya nulos y coincida con el tipo User
          const fullUser: any = {
            ...profile,
            email: session.user.email,
            full_name: profile.full_name || 'Atleta',
            level: profile.fitness_level || Difficulty.BEGINNER, // Sincronizamos con 'level' de types.ts
            weight_kg: profile.weight || profile.weight_kg || 70,
            height_cm: profile.height || profile.height_cm || 175,
            goal: profile.goal || WorkoutFocus.HYPERTROPHY,
            diet_type: profile.diet || DietType.OMNIVORE,
            injuries: Array.isArray(profile.injuries) ? profile.injuries : [],
            workout_sessions: Array.isArray(profile.workout_sessions) ? profile.workout_sessions : [],
            nutrition: profile.nutrition || { calories: 2000, protein: 150, carbs: 200, fat: 60 }
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

  // Usamos 'any' en userData para evitar que TS se queje de fitness_level vs level durante el guardado
  const handleOnboardingComplete = async (userData: any) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: userData.full_name,
        goal: userData.goal,
        fitness_level: userData.fitness_level || userData.level, 
        weight: userData.weight_kg,
        height: userData.height_cm,
        diet: userData.diet || userData.diet_type,
        age: userData.age,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      window.location.reload(); 
    } catch (e: any) { 
      alert("Error al guardar: " + e.message); 
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center animate-pulse">
        <p className="font-black uppercase italic text-slate-900 text-xs tracking-widest">Cargando Sistema...</p>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto p-4">
      {step === 'legal' && <LegalDisclaimer onAccept={() => setStep('onboarding')} />}
      {step === 'onboarding' && <OnboardingForm onComplete={handleOnboardingComplete} />}
      {step === 'dashboard' && user && (
        <ProfileDashboard 
          user={user} 
          onAddMetric={async () => {}} 
        />
      )}
    </main>
  );
}