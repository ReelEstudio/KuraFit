'use client';
import React from 'react';
import WorkoutPlayer from '../components/WorkoutPlayer';
import { useRouter } from 'next/navigation';

export default function WorkoutPage() {
  const router = useRouter();

  // Esta es una sesión de prueba para que el reproductor no falle
  const sessionData = {
    id: '1',
    focus: 'STRENGTH',
    warmup: [{ name: 'Movilidad', video_id: 'q6v2vN2Z3E0', completed: false }],
    exercises: [{
      id: 'ex1',
      name: 'Sentadilla',
      muscle_target: 'legs',
      video_id: 'MeIi6Y7a_3M',
      sets: [{ reps: '12', completed: false }]
    }],
    cardio_finisher: { name: 'Jumping Jacks', video_id: 'UpH7rm0cYbM', description: '30s' },
    cooldown: [{ name: 'Estiramiento', video_id: 'Lp99_nE_TfU', description: 'Relaja' }]
  };

  return (
    <WorkoutPlayer 
      session={sessionData as any} 
      userInjuries={[]} 
      onClose={() => router.push('/')} 
      onComplete={() => router.push('/')} 
    />
  );
}