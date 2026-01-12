'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WorkoutPlayer from './WorkoutPlayer';
import { SessionCompletionStatus } from '../types';

export default function WorkoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'hypertrophy';
  
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    // Simulamos la carga de la sesión o la llamada a la API
    const mockSession = {
      id: 'temp-id',
      focus: type.toUpperCase(),
      exercises: [],
      warmup: [],
      cooldown: [],
      status: SessionCompletionStatus.FULL,
      created_at: new Date().toISOString()
    };
    setSessionData(mockSession);
    setLoading(false);
  }, [type]);

  const handleFinish = async (status: SessionCompletionStatus) => {
    console.log("Sesión finalizada con estado:", status);
    // Aquí iría la lógica para guardar en Supabase
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-2xl font-black italic animate-pulse text-slate-300 uppercase">Generando Rutina...</p>
      </div>
    );
  }

  return (
    <WorkoutPlayer 
      session={sessionData} 
      onComplete={handleFinish}
      onExit={() => router.push('/dashboard')}
    />
  );
}