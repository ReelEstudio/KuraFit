'use client';
import React, { useEffect, useState } from 'react';
import ProfileDashboard from '../components/ProfileDashboard';
import { User, Difficulty, DietType } from '../types';

export default function DashboardPage() {
  // Inicializamos con null pero especificamos que contendrá un tipo User
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Simulación de carga de datos. 
    // NOTA: Asegúrate de que este objeto tenga TODOS los campos obligatorios de la interfaz User
    const mockUser: User = {
      id: '1',
      full_name: 'Usuario KuraFit',
      goal: 'Ganancia Muscular',
      level: Difficulty.INTERMEDIATE,
      diet_type: DietType.OMNIVORE,
      age: 30,
      stress_level: 3,
      sleep_quality: 3,
      nutrition: { 
        calories: 2400, 
        protein: 180, 
        carbs: 250, 
        fat: 80 
      },
      injuries: [],
      available_equipment: [],
      workout_sessions: []
    };
    
    setUserData(mockUser);
  }, []);

  const handleAddMetric = async (metric: any) => {
    console.log('Nueva métrica recibida:', metric);
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-black italic uppercase animate-pulse text-slate-300">Cargando Dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <ProfileDashboard 
        user={userData} 
        onAddMetric={handleAddMetric} 
      />
    </main>
  );
}