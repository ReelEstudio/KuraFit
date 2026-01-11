import { 
  User, 
  WorkoutFocus, 
  Equipment, 
  MuscleGroup, 
  WorkoutSession,
  WorkoutExercise,
  Difficulty 
} from '../types';

// Definimos localmente lo que falta para que el motor no de error, 
// o puedes moverlos a types.ts después
interface Exercise {
  id: string;
  name: string;
  muscle_target: MuscleGroup;
  equipment: Equipment[];
  is_compound: boolean;
  video_id: string;
}

interface ProtocolStep {
  name: string;
  duration_min: number;
  description: string;
  video_id: string;
}

interface WeeklyWorkoutPlan {
  user_id: string;
  sessions: WorkoutSession[];
  created_at: string;
}