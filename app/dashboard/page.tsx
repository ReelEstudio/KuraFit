'use client';
import React, { useEffect, useState } from 'react';
import ProfileDashboard from '../components/ProfileDashboard';
import { supabase } from '../lib/supabase';
import { User, Difficulty, DietType } from '../types';

export default function DashboardPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/login';
          return;
        }

        // Traemos el perfil y las sesiones de entrenamiento
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*, workout_sessions(*)')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        // Mapeamos los datos de Supabase al tipo 'User' que espera el Dashboard
        const mappedUser: User = {
          ...profile,
          level: profile.fitness_level || Difficulty.BEGINNER,
          diet_type: profile.diet || DietType.OMNIVORE,
          // Si nutrition viene como JSON de la DB, lo usamos; si no, ponemos valores base
          nutrition: profile.nutrition || { calories: 2000, protein: 150, carbs: 200, fat: 60 },
          workout_sessions: profile.workout_sessions || [],
          injuries: profile.injuries || [],
          available_equipment: profile.available_equipment || [],
          age: profile.age || 30,
          stress_level: profile.stress_level || 3,
          sleep_quality: profile.sleep_quality || 3
        };

        setUserData(mappedUser);
      } catch (err) {
        console.error("Error cargando datos reales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddMetric = async (metric: any) => {
    // Aquí podrías guardar peso/grasa en Supabase
    console.log('Guardando métrica en DB:', metric);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <p className="font-black italic uppercase animate-pulse text-slate-900">Sincronizando con KuraFit...</p>
    </div>
  );

  if (!userData) return null;

  return (
    <main className="min-h-screen bg-white">
      <ProfileDashboard 
        user={userData} 
        onAddMetric={handleAddMetric} 
      />
    </main>
  );
}