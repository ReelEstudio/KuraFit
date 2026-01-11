'use client';

import React, { Suspense } from 'react';
import WorkoutPlayer from '../components/WorkoutPlayer'; 
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../utils/supabase/client'; 

// ESTA LÍNEA ES CLAVE para Next.js 16+:
export const dynamic = 'force-dynamic';

function WorkoutDataHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Obtenemos el tipo o usamos STRENGTH por defecto
  const workoutType = searchParams.get('type')?.toUpperCase() || 'STRENGTH';

  const sessionData = {
    id: Date.now().toString(),
    focus: workoutType,
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
        await supabase.from('workout_sessions').insert({
          user_id: user.id,
          focus: workoutType, 
          status: status
        });
      }
    } catch (error) {
      console.error("Error al guardar sesión:", error);
    } finally {
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

export default function WorkoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center text-white font-black italic">
        CARGANDO SESIÓN...
      </div>
    }>
      <WorkoutDataHandler />
    </Suspense>
  );
}