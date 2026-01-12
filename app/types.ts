export enum WorkoutFocus {
  STRENGTH = 'STRENGTH',
  HYPERTROPHY = 'HYPERTROPHY',
  METABOLIC = 'METABOLIC',
  PERFORMANCE = 'PERFORMANCE'
}

export enum DietType {
  OMNIVORE = 'OMNIVORE',
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
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

export enum SessionCompletionStatus {
  FULL = 'full',
  EARLY = 'early'
}

export interface WorkoutSet {
  reps?: number;
  weight?: number;
  duration?: number;
  rest: number;
  completed?: boolean;
}

export interface ProtocolStep {
  name: string;
  duration_min: number;
  description: string;
  video_id: string;
  completed?: boolean;
}

export type MuscleGroup = string;

export interface Injury {
  name: string;
  severity?: 'low' | 'medium' | 'high';
}

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
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  focus: WorkoutFocus;
  exercises: WorkoutExercise[];
  warmup: ProtocolStep[];
  cardio_finisher?: ProtocolStep;
  cooldown: ProtocolStep[];
  status: SessionCompletionStatus;
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