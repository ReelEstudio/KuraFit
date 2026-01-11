'use client';

import React, { useState, useEffect } from 'react';
// Importamos el cliente que creamos en lib para no repetir código
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';
import { 
  User, 
  MuscleGroup, 
  Difficulty, 
  Equipment,
  WorkoutFocus,
  WeeklyWorkoutPlan,
  WorkoutSession,
  MetricEntry,
  NutritionPlan,
  Exercise
} from './types';

import { WorkoutEngine } from './services/workoutEngine';
import Calendar from './components/Calendar';
import OnboardingForm from './components/OnboardingForm';
import ProfileDashboard from './components/ProfileDashboard';
import WorkoutPlayer from './components/WorkoutPlayer';
import LegalDisclaimer from './components/LegalDisclaimer';

const STORAGE_KEY = 'kurafit_user_data';
const LEGAL_KEY = 'kurafit_legal_accepted';

// Mantenemos tus MOCK_EXERCISES igual...
const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Sentadilla con Barra', description: 'Mantén los pies a la anchura de los hombros.', muscle_target: MuscleGroup.LEGS, difficulty: Difficulty.ADVANCED, equipment: [Equipment.BARBELL], is_compound: true, substitute_id: '7', video_id: 'SW_C1A-rejs' },
  // ... (el resto de tus ejercicios)
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'legal' | 'onboarding' | 'dashboard'>('legal');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      // 1. Verificar si hay sesión activa en Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login'); // Si no está logueado, fuera
        return;
      }

      // 2. Revisar si ya tiene perfil en la base de datos
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser(profile as any);
        setStep('dashboard');
        await generatePlan(profile as any);
      } else {
        const legalAccepted = localStorage.getItem(LEGAL_KEY);
        setStep(legalAccepted ? 'onboarding' : 'legal');
      }
      
      setLoading(false);
    };
    initApp();
  }, []);

  // Tu función de nutrición se queda igual...
  const calculateNutrition = (u: Partial<User>): NutritionPlan => {
    const tmb = (10 * (u.weight_kg || 70)) + (6.25 * (u.height_cm || 170)) - (5 * (u.age || 25)) + 5;
    let multiplier = (u.sessions_per_week || 3) >= 4 ? 1.55 : 1.375;
    let calories = tmb * multiplier;
    if (u.goal === WorkoutFocus.METABOLIC) calories -= 400;
    if (u.goal === WorkoutFocus.HYPERTROPHY) calories += 300;
    return {
      calories: Math.round(calories),
      protein_g: Math.round((calories * 0.3) / 4),
      carbs_g: Math.round((calories * 0.4) / 4),
      fats_g: Math.round((calories * 0.3) / 9),
      key_micros: ['Magnesio', 'Zinc', 'Vitamina D3']
    };
  };

  const generatePlan = async (userData: User) => {
    const engine = new WorkoutEngine();
    const newPlan = await engine.generateWeeklyPlan(userData, MOCK_EXERCISES);
    setPlan(newPlan);
  };

  const handleLegalAccept = () => {
    localStorage.setItem(LEGAL_KEY, 'true');
    setStep('onboarding');
  };

  const handleOnboardingComplete = async (userData: User) => {
    setLoading(true);
    
    // Obtener el ID del usuario logueado actualmente
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const nutrition = calculateNutrition(userData);
    const userWithMetrics: User = { 
      ...userData, 
      id: session.user.id, // IMPORTANTE: Usamos el ID de Supabase, no uno aleatorio
      completed_sessions_count: 0, 
      nutrition
    };
    
    try {
      // Guardamos en la tabla 'profiles' que creamos en el SQL Editor
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: userData.full_name,
        goal: userData.goal,
        fitness_level: userData.fitness_level,
        weight: userData.weight_kg,
        height: userData.height_cm,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      setUser(userWithMetrics);
      await generatePlan(userWithMetrics);
      setStep('dashboard');
    } catch (e: any) { 
      alert("Error al guardar perfil: " + e.message); 
    } finally {
      setLoading(false);
    }
  };

  // ... (El resto del render se mantiene igual)
  return (
    // Pega aquí tu bloque de return original
  );
}