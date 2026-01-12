'use client';
import React, { useEffect, useState } from 'react';
import ProfileDashboard from '../components/ProfileDashboard';
import { User, SessionCompletionStatus } from '../types';

export default function DashboardPage() {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Simulación de carga de datos de usuario
    const mockUser: User = {
      id: '1',
      full_name: 'Usuario KuraFit',
      goal: 'Ganancia Muscular',
      diet_type: 'OMNIVORE' as any,
      level: 'INTERMEDIATE' as any,
      nutrition: { calories: 2400, protein: 180, carbs: 250, fat: 80 },
      injuries: [],
      available_equipment: [],
      workout_sessions: []
    };
    setUserData(mockUser);
  }, []);

  const handleAddMetric = async (metric: any) => {
    console.log('Nueva métrica:', metric);
  };

  if (!userData) return null;

  return (
    <main className="min-h-screen bg-white">
      <ProfileDashboard 
        user={userData} 
        onAddMetric={handleAddMetric} 
      />
    </main>
  );
}