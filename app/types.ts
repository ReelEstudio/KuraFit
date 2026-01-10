export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum Equipment {
  BODYWEIGHT = 'bodyweight',
  DUMBBELL = 'dumbbell',
  BARBELL = 'barbell',
  MACHINE = 'machine',
  CABLE = 'cable'
}

export enum MuscleGroup {
  CHEST = 'chest',
  BACK = 'back',
  LEGS = 'legs',
  SHOULDERS = 'shoulders',
  ARMS = 'arms',
  CORE = 'core'
}

export enum WorkoutFocus {
  STRENGTH = 'strength',
  HYPERTROPHY = 'hypertrophy',
  METABOLIC = 'metabolic',
  PERFORMANCE = 'performance'
}

export enum DietType {
  OMNIVORE = 'omnivore',
  VEGAN = 'vegan',
  KETO = 'keto',
  PALEO = 'paleo',
  VEGETARIAN = 'vegetarian'
}

export interface MetricEntry {
  date: Date;
  weight_kg: number;
  body_fat_pct?: number;
  muscle_mass_kg?: number;
}

export interface Injury {
  id: string;
  name: string;
  category: 'joint' | 'muscle' | 'chronic';
  details?: string;
  is_current: boolean;
  recovery_time?: string;
}

export interface NutritionPlan {
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  calories: number;
  key_micros: string[];
}

export type SessionCompletionStatus = 'full' | 'early';

export interface CompletedSessionRecord {
  id: string;
  date: Date;
  focus: WorkoutFocus;
  status: SessionCompletionStatus;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  weight_kg: number;
  height_cm: number;
  fitness_level: Difficulty;
  goal: WorkoutFocus;
  diet: DietType;
  sleep_quality: number;
  stress_level: number;
  available_equipment: Equipment[];
  injuries: Injury[];
  sessions_per_week?: number;
  metrics_history: MetricEntry[];
  nutrition?: NutritionPlan;
  completed_sessions_count: number;
  early_finished_count: number;
  session_history: CompletedSessionRecord[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscle_target: MuscleGroup;
  difficulty: Difficulty;
  equipment: Equipment[];
  is_compound: boolean;
  substitute_id?: string;
  video_id?: string;
}

export interface WorkoutSet {
  reps: number;
  weight_kg: number;
  completed: boolean;
}

export interface WorkoutExercise extends Exercise {
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: Date;
  focus: WorkoutFocus;
  exercises: WorkoutExercise[];
  warmup: any[];
  cooldown: any[];
  cardio_finisher?: any;
  is_completed: boolean;
}

export interface WeeklyWorkoutPlan {
  user_id: string;
  week_number: number;
  sessions: WorkoutSession[];
}
export interface ProtocolStep {
  id: string;
  instruction: string;
  duration_seconds?: number;
}
