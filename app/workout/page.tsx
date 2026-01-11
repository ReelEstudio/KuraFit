'use client';

import React from 'react';
import WorkoutPlayer from '../components/WorkoutPlayer'; // Ajustado según tu estructura
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client'; // Ajustado para subir dos niveles

export default function WorkoutPage() {
  const router = useRouter();
  const supabase = createClient();

  // Datos de ejemplo para la sesión
  const sessionData = {
    id: '1',
    focus: 'STRENGTH',
    warmup: [{ name: 'Movilidad', video_id: 'q6v2vN2Z3E0', completed: false }],
    exercises: [{
      id: 'ex1',
      name: 'Sentadilla Goblet',
      muscle_target: 'legs',
      video_id: 'MeIi6Y7a_3M',
      sets: [{ reps: '12', completed: false }]
    }],
    cardio_finisher: { name: 'Jumping Jacks', video_id: 'UpH7rm0cYbM', description: '30s' },
    cooldown: [{ name: 'Estiramiento', video_id: 'Lp99_nE_TfU', description: 'Relaja' }]
  };

  const handleFinish = async (status: 'full' | 'early') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Registramos la sesión en la base de datos
        await supabase.from('workout_sessions').insert({
          user_id: user.id,
          focus: sessionData.focus,
          status: status
        });
      }
    } catch (error) {
      console.error("Error al guardar sesión:", error);
    } finally {
      // Regresamos al dashboard y refrescamos los datos
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <WorkoutPlayer 
      session={sessionData as any} 
      userInjuries={[]} 
      onClose={() => router.push('/dashboard')} 
      onComplete={(status) => handleFinish(status as any)} 
    />
  );
}