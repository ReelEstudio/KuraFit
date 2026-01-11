export enum WorkoutFocus {
  STRENGTH = 'STRENGTH',
  HYPERTROPHY = 'HYPERTROPHY',
  METABOLIC = 'METABOLIC',
  PERFORMANCE = 'PERFORMANCE'
}

export enum DietType {
  OMNIVORE = 'OMNIVORE',
  VEGAN = 'VEGAN',
  KETO = 'KETO',
  PALEO = 'PALEO'
}

export enum Equipment {
  BODYWEIGHT = 'BODYWEIGHT',
  DUMBBELLS = 'DUMBBELLS',
  BARBELL = 'BARBELL',
  KETTLEBELL = 'KETTLEBELL',
  RESISTANCE_BANDS = 'RESISTANCE_BANDS'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export type MuscleGroup = 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core' | 'Full Body' | string;
export type Injury = 'Hombro' | 'Rodilla' | 'Espalda Baja' | 'Muñeca' | 'Ninguna' | string;

export interface MetricEntry {
  date: string;
  weight: number;
  fat?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscle_target: string;
  video_id: string;
  sets: { reps: string; weight_kg: number; completed: boolean }[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  focus: WorkoutFocus;
  exercises: WorkoutExercise[];
  status: 'full' | 'early';
  created_at: string;
}

export interface User {
  id: string;
  full_name: string;
  goal: string;
  diet_type: DietType;
  level: Difficulty;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  workout_sessions?: WorkoutSession[];
  injuries: Injury[];
  available_equipment: Equipment[];
}

export interface Exercise extends WorkoutExercise {
  equipment: Equipment[];
  is_compound: boolean;
}

export interface ProtocolStep {
  name: string;
  duration_min: number;
  description: string;
  video_id: string;
}

export interface WeeklyWorkoutPlan {
  sessions: WorkoutSession[];
}