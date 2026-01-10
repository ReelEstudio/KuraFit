
import { User, Difficulty, WorkoutFocus } from '../types';

export interface FrequencyRecommendation {
  days: number;
  reason: string;
  isRestricted: boolean;
}

export const calculateRecommendedFrequency = (user: User): FrequencyRecommendation => {
  const hasInjuries = user.injuries.length > 0;
  const isSenior = user.age > 60;
  const highStress = user.stress_level > 3;
  const poorSleep = user.sleep_quality < 3;

  // 1. RESTRICCIÓN MÉDICA Y RECUPERACIÓN CRÍTICA
  if (hasInjuries || isSenior || (highStress && poorSleep)) {
    let reason = "";
    if (hasInjuries || isSenior) {
      reason = isSenior 
        ? "Priorizamos la longevidad articular con 3 días de Full Body."
        : "Recomendamos 3 días para asegurar que tus lesiones tengan tiempo de sanar entre estímulos.";
    } else {
      reason = "Tus niveles de estrés y falta de sueño sugieren que tu sistema nervioso necesita más descanso. 3 días es lo óptimo para evitar el sobreentrenamiento.";
    }

    return {
      days: 3,
      reason,
      isRestricted: true
    };
  }

  // 2. NIVEL DE EXPERIENCIA
  if (user.fitness_level === Difficulty.BEGINNER) {
    return {
      days: 3,
      reason: "Como principiante, tu cuerpo necesita adaptarse gradualmente. 3 días permiten una progresión segura.",
      isRestricted: false
    };
  }

  // 3. OBJETIVOS Y ESTILO DE VIDA (MODERADO)
  if (user.fitness_level === Difficulty.ADVANCED && !highStress) {
    if (user.goal === WorkoutFocus.HYPERTROPHY || user.goal === WorkoutFocus.PERFORMANCE) {
      return {
        days: 5,
        reason: "Tu base física y bajo estrés permiten un volumen de 5 días para resultados máximos.",
        isRestricted: false
      };
    }
  }

  return {
    days: 4,
    reason: "4 días es el 'punto dulce' para equilibrio entre trabajo, vida personal y progreso físico.",
    isRestricted: false
  };
};
