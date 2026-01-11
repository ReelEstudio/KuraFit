'use client';

import React, { Suspense } from 'react'; // 1. Importar Suspense
import WorkoutPlayer from '../components/WorkoutPlayer'; 
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../utils/supabase/client'; 

// 2. Mover la lógica a un componente interno
function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

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

// 3. El export principal ahora envuelve el contenido en Suspense
export default function WorkoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center text-white">Cargando entrenamiento...</div>}>
      <WorkoutContent />
    </Suspense>
  );
}