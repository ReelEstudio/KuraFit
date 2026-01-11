'use client';
import React from 'react';
import WorkoutPlayer from '../components/WorkoutPlayer';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function WorkoutPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

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

  const handleSessionFinish = async (status: 'full' | 'early') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('workout_sessions').insert({
          user_id: user.id,
          focus: sessionData.focus,
          status: status
        });
      }
    } catch (error) {
      console.error("Error guardando sesión:", error);
    } finally {
      // Siempre volvemos al dashboard, falle o no la base de datos
      router.push('/dashboard');
    }
  };

  return (
    <WorkoutPlayer 
      session={sessionData as any} 
      userInjuries={[]} 
      onClose={() => router.push('/dashboard')} 
      onComplete={(status) => handleSessionFinish(status as any)} 
    />
  );
}