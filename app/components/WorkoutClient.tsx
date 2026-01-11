'use client';

import React, { useState, useEffect } from 'react';
import WorkoutPlayer from './WorkoutPlayer'; 
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../utils/supabase/client'; 

export default function WorkoutClient() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="min-h-screen bg-[#1a1f2e]" />;

  const workoutType = searchParams.get('type')?.toUpperCase() || 'STRENGTH';

  const sessionData = {
    id: Date.now().toString(),
    focus: workoutType,
    warmup: [{ name: 'Movilidad Articular', video_id: 'q6v2vN2Z3E0', completed: false }],
    exercises: [{
      id: 'ex1',
      name: workoutType === 'METABOLIC' ? 'Burpees Explosivos' : 'Sentadilla Goblet',
      muscle_target: 'Full Body',
      video_id: 'MeIi6Y7a_3M',
      sets: [{ reps: '12', completed: false }]
    }],
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
      console.error("Error:", error);
    } finally {
      // PUNTO 4 CORREGIDO: Redirigir al dashboard, no al login
      router.push('/dashboard'); 
      router.refresh();
    }
  };

  return (
    <WorkoutPlayer 
      session={sessionData as any} 
      userInjuries={[]} 
      onClose={() => router.push('/dashboard')} 
      onComplete={(status: any) => handleFinish(status)} 
    />
  );
}