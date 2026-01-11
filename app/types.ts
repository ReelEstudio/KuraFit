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

export type MuscleGroup = string;
export type Injury = string;

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
  sets: any[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  focus: WorkoutFocus;
  exercises: any[];
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
  workout_sessions?: any[];
  injuries: any[];
  available_equipment: any[];
}