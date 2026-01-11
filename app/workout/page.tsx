'use client';

import React from 'react';
import WorkoutPlayer from '../components/WorkoutPlayer'; 
import { useRouter, useSearchParams } from 'next/navigation'; // Añadido useSearchParams
import { createClient } from '../../utils/supabase/client'; 

export default function WorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Capturamos el tipo de la URL (ej: ?type=strength)
  const workoutType = searchParams.get('type')?.toUpperCase() || 'STRENGTH';

  // Datos dinámicos según la elección
  const sessionData = {
    id: Date.now().toString(),
    focus: workoutType, // Ahora es dinámico
    warmup: [{ name: 'Movilidad Articular', video_id: 'q6v2vN2Z3E0', completed: false }],
    exercises: workoutType === 'METABOLIC' ? [
      {
        id: 'ex-met',
        name: 'Burpees explosivos',
        muscle_target: 'full body',
        video_id: 'UpH7rm0cYbM',
        sets: [{ reps: '20s', completed: false }]
      }
    ] : [
      {
        id: 'ex1',
        name: workoutType === 'HYPERTROPHY' ? 'Press Militar' : 'Sentadilla Goblet',
        muscle_target: 'compound',
        video_id: 'MeIi6Y7a_3M',
        sets: [{ reps: '12', completed: false }]
      }
    ],
    cardio_finisher: { name: 'Cardio Final', video_id: 'UpH7rm0cYbM', description: '30s' },
    cooldown: [{ name: 'Estiramiento', video_id: 'Lp99_nE_TfU', description: 'Relaja' }]
  };

  const handleFinish = async (status: 'full' | 'early') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Guardamos el enfoque real elegido
        await supabase.from('workout_sessions').insert({
          user_id: user.id,
          focus: workoutType, 
          status: status
        });
      }
    } catch (error) {
      console.error("Error al guardar sesión:", error);
    } finally {
      // Redirigir al dashboard para ver el punto en el calendario
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