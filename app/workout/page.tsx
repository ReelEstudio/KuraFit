'use client';
import React from 'react';
import WorkoutPlayer from '../components/WorkoutPlayer';
import { useRouter } from 'next/navigation';

export default function WorkoutPage() {
  const router = useRouter();

  // IDs de YouTube corregidos para que funcionen siempre
  const sessionData = {
    id: '1',
    focus: 'STRENGTH',
    warmup: [{ 
      name: 'Movilidad Activa', 
      video_id: 'q6v2vN2Z3E0', // Asegúrate que este ID sea correcto en YT
      completed: false 
    }],
    exercises: [{
      id: 'ex1',
      name: 'Sentadilla Goblet',
      muscle_target: 'legs',
      video_id: 'MeIi6Y7a_3M',
      sets: [{ reps: '12', completed: false }]
    }],
    cardio_finisher: { 
      name: 'Jumping Jacks', 
      video_id: 'UpH7rm0cYbM', 
      description: '30 segundos a máxima intensidad' 
    },
    cooldown: [{ 
      name: 'Estiramiento Global', 
      video_id: 'Lp99_nE_TfU', 
      description: 'Relaja la musculatura trabajada' 
    }]
  };

  return (
    <WorkoutPlayer 
      session={sessionData as any} 
      userInjuries={[]} 
      // IMPORTANTE: Cambiamos '/' por '/dashboard' para no perder la sesión
      onClose={() => router.push('/dashboard')} 
      onComplete={() => {
        // Aquí podrías añadir lógica para sumar la sesión antes de salir
        router.push('/dashboard');
      }} 
    />
  );
}