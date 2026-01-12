'use client';
import React, { useEffect, useState, useCallback } from 'react';
import ProfileDashboard from '../components/ProfileDashboard';
import WorkoutPlayer from '../components/WorkoutPlayer'; // Importación vital
import { supabase } from '../lib/supabase';
import { User, Difficulty, DietType, WorkoutSession, SessionCompletionStatus } from '../types';

export default function DashboardPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  // Función envuelta en useCallback para poder reutilizarla al finalizar un entreno
  const fetchUserData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, workout_sessions(*)')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      const mappedUser: User = {
        ...profile,
        level: profile.fitness_level || Difficulty.BEGINNER,
        diet_type: profile.diet || DietType.OMNIVORE,
        nutrition: profile.nutrition || { calories: 2000, protein: 150, carbs: 250, fat: 70 },
        workout_sessions: profile.workout_sessions || [],
        injuries: profile.injuries || [],
        available_equipment: profile.available_equipment || [],
        age: profile.age || 30,
        stress_level: profile.stress_level || 3,
        sleep_quality: profile.sleep_quality || 3
      };

      setUserData(mappedUser);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Esta función se ejecuta cuando el Player termina
  const handleWorkoutComplete = async (status: SessionCompletionStatus) => {
    setActiveSession(null); // Cerramos el reproductor
    setLoading(true);
    await fetchUserData(); // Recargamos datos para ver el nuevo entreno en el calendario
  };

  if (loading && !userData) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <p className="font-black italic uppercase animate-pulse text-slate-900">Sincronizando con KuraFit...</p>
    </div>
  );

  if (!userData) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Si hay una sesión activa, mostramos el Player. Si no, el Dashboard */}
      {activeSession ? (
        <WorkoutPlayer 
          session={activeSession}
          onComplete={handleWorkoutComplete}
          onExit={() => setActiveSession(null)}
        />
      ) : (
        <ProfileDashboard 
          user={userData} 
          // Aquí es donde el Dashboard le avisa a esta página que inicie un entreno
          // Si tu ProfileDashboard tiene un botón que genera una sesión, pásala aquí
          onAddMetric={async (m) => console.log(m)} 
        />
      )}
    </main>
  );
}