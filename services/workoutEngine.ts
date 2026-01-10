
import { 
  User, 
  Exercise, 
  WeeklyWorkoutPlan, 
  WorkoutFocus, 
  Equipment, 
  MuscleGroup, 
  WorkoutSession,
  WorkoutExercise,
  ProtocolStep,
  Injury,
  Difficulty
} from '../types';

export class WorkoutEngine {
  async generateWeeklyPlan(
    user: User, 
    allExercises: Exercise[]
  ): Promise<WeeklyWorkoutPlan> {
    const restrictedGroups = this.getRestrictedGroupsByInjuries(user.injuries);
    
    const safeExercises = allExercises.filter(ex => {
      const isTargetRestricted = restrictedGroups.includes(ex.muscle_target);
      if (isTargetRestricted && ex.is_compound) return false;
      const hasEquipment = ex.equipment.some(eq => user.available_equipment.includes(eq)) || 
                          ex.equipment.includes(Equipment.BODYWEIGHT);
      return hasEquipment;
    });

    // Sesiones Base obligatorias
    const sessions: WorkoutSession[] = [
      this.createSession(safeExercises, allExercises, WorkoutFocus.STRENGTH, 1),
      // Fix: Corrected typo from HYPERTREOPHY to HYPERTROPHY
      this.createSession(safeExercises, allExercises, WorkoutFocus.HYPERTROPHY, 3),
      this.createSession(safeExercises, allExercises, WorkoutFocus.METABOLIC, 5),
    ];

    /**
     * LÓGICA DINÁMICA DE SESIÓN CARDIO/FUNCIONAL:
     * 1. Nivel Fitness: Solo usuarios con base sólida (Intermediate+) para evitar sobrecarga del SNC.
     * 2. Objetivo: Prioridad absoluta si el objetivo es METABOLIC (pérdida de grasa).
     * 3. Disponibilidad: Si el usuario seleccionó 4 o más días, esta sesión se vuelve el pilar de recuperación activa.
     */
    const isLevelReady = user.fitness_level !== Difficulty.BEGINNER;
    const isGoalCompatible = user.goal === WorkoutFocus.METABOLIC || user.goal === WorkoutFocus.PERFORMANCE;
    const hasEnoughFrequency = (user.sessions_per_week || 3) >= 4;

    if (isLevelReady && (isGoalCompatible || hasEnoughFrequency)) {
      sessions.push(this.createCardioFunctionalSession(safeExercises, allExercises, 6, user));
    }

    return {
      user_id: user.id,
      week_number: 1,
      sessions
    };
  }

  private getRestrictedGroupsByInjuries(injuries: Injury[]): MuscleGroup[] {
    const restricted: Set<MuscleGroup> = new Set();
    injuries.forEach(injury => {
      const name = injury.name.toLowerCase();
      if (['rodilla', 'tobillo', 'pie', 'rodillas'].some(k => name.includes(k))) restricted.add(MuscleGroup.LEGS);
      if (['hombro', 'codo', 'muñeca', 'hombros'].some(k => name.includes(k))) {
        restricted.add(MuscleGroup.SHOULDERS);
        restricted.add(MuscleGroup.CHEST);
        restricted.add(MuscleGroup.BACK);
      }
      if (['espalda', 'lumbar', 'columna'].some(k => name.includes(k))) {
        restricted.add(MuscleGroup.BACK);
        restricted.add(MuscleGroup.CORE);
        restricted.add(MuscleGroup.LEGS);
      }
    });
    return Array.from(restricted);
  }

  private createSession(pool: Exercise[], allExercises: Exercise[], focus: WorkoutFocus, dayOffset: number): WorkoutSession {
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() + dayOffset);
    const selectedExercises: WorkoutExercise[] = [];
    const targets: MuscleGroup[] = [MuscleGroup.LEGS, MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS, MuscleGroup.CORE];

    targets.forEach(target => {
      const globalIdeal = allExercises.find(ex => ex.muscle_target === target && ex.is_compound) || 
                          allExercises.find(ex => ex.muscle_target === target);
      if (!globalIdeal) return;
      const accessibleForTarget = pool.filter(ex => ex.muscle_target === target);
      const safeCompounds = accessibleForTarget.filter(ex => ex.is_compound);
      const safeIsolation = accessibleForTarget.filter(ex => !ex.is_compound);
      let chosenExercise: Exercise | null = null;

      if (pool.some(p => p.id === globalIdeal.id)) chosenExercise = globalIdeal;
      else if (safeCompounds.length > 0) chosenExercise = safeCompounds[0];
      else if (safeIsolation.length > 0) chosenExercise = safeIsolation[0];

      if (chosenExercise) {
        const isSub = chosenExercise.id !== globalIdeal.id;
        selectedExercises.push({
          ...chosenExercise,
          sets: this.generateSetsForFocus(focus),
          notes: isSub ? `Sustitución de seguridad por compromiso articular.` : "",
          is_substitute: isSub,
          replaced_exercise_name: isSub ? globalIdeal.name : undefined
        });
      }
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: sessionDate,
      focus,
      exercises: selectedExercises,
      warmup: this.generateWarmup(selectedExercises),
      cooldown: this.generateCooldown(),
      cardio_finisher: this.generateCardio(focus),
      is_completed: false
    };
  }

  /**
   * Genera una sesión híbrida de entrenamiento funcional y cardio adaptativo.
   * LÓGICA DE SELECCIÓN:
   * 1. Prioriza ejercicios multiarticulares explosivos según el equipo disponible.
   * 2. Ajusta el "finisher" de cardio basado en si el usuario tiene acceso a máquinas,
   *    pesas libres o solo su propio peso corporal.
   */
  private createCardioFunctionalSession(pool: Exercise[], allExercises: Exercise[], dayOffset: number, user: User): WorkoutSession {
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() + dayOffset);
    
    // Seleccionamos ejercicios que permitan un flujo dinámico (funcional)
    const functionalPool = pool.filter(ex => 
      ex.equipment.includes(Equipment.BODYWEIGHT) || 
      ex.equipment.includes(Equipment.DUMBBELL) ||
      ex.equipment.includes(Equipment.CABLE)
    );

    const selectedExercises: WorkoutExercise[] = [];
    // Estructura de circuito metabólico para maximizar el consumo de oxígeno post-ejercicio (EPOC)
    const circuitTargets = [MuscleGroup.LEGS, MuscleGroup.CORE, MuscleGroup.BACK, MuscleGroup.CHEST];
    
    circuitTargets.forEach((target, index) => {
      const options = functionalPool.filter(ex => ex.muscle_target === target);
      // Usamos el índice para variar la selección si hay múltiples opciones
      const chosen = options[index % options.length] || pool[0];
      
      selectedExercises.push({
        ...chosen,
        sets: this.generateSetsForFocus(WorkoutFocus.PERFORMANCE),
        notes: `CIRCUITO METABÓLICO: Realizar sin descanso entre ejercicios del mismo bloque.`,
        is_substitute: false
      });
    });

    // LÓGICA DE CARDIO FINISHER BASADA EN EQUIPAMIENTO
    let finisher: ProtocolStep = {
      name: "HIIT Final: Burpees y Sprints",
      duration_min: 12,
      description: "Protocolo 30/30: 30s explosivos, 30s recuperación activa.",
      video_id: "ml6cT4AZdqI"
    };

    if (user.available_equipment.includes(Equipment.MACHINE)) {
      /**
       * Si el usuario tiene acceso a máquinas, priorizamos opciones de bajo impacto 
       * pero alta demanda metabólica como el Remo o la Bicicleta de Aire.
       */
      finisher = {
        name: "Intervalos en Máquina (Remo/Eco-Bike)",
        duration_min: 15,
        description: "Enfoque en potencia aeróbica. Mantener 80-90% de capacidad máxima en intervalos de 1 minuto.",
        video_id: "8fL-U0eFkMc"
      };
    } else if (user.available_equipment.includes(Equipment.BARBELL) && user.fitness_level === Difficulty.ADVANCED) {
      /**
       * Para usuarios avanzados con barra, los "Complexes" son la mejor herramienta 
       * para mejorar la capacidad de trabajo y fuerza-resistencia.
       */
      finisher = {
        name: "Complejo de Barra 'EMOM'",
        duration_min: 10,
        description: "Realizar 5 repeticiones de Clean & Press cada minuto. Descansa el tiempo restante del minuto.",
        video_id: "IZxyjW7MPJQ"
      };
    }

    return {
      id: `func-${Math.random().toString(36).substr(2, 5)}`,
      date: sessionDate,
      focus: WorkoutFocus.PERFORMANCE,
      exercises: selectedExercises,
      warmup: [
        { 
          name: "Activación Biomecánica", 
          duration_min: 6, 
          description: "Preparación articular específica para movimientos multiplanares.",
          video_id: "XW_A-rejs"
        }
      ],
      cooldown: this.generateCooldown(),
      cardio_finisher: finisher,
      is_completed: false
    };
  }

  private generateWarmup(exercises: WorkoutExercise[]): ProtocolStep[] {
    const muscles = Array.from(new Set(exercises.map(e => e.muscle_target)));
    return [
      { 
        name: "Movilidad Articular", 
        duration_min: 3, 
        description: "Rotaciones controladas para lubricación sinovial.",
        video_id: "XW_A-rejs"
      },
      { 
        name: `Activación de ${muscles[0]}`, 
        duration_min: 5, 
        description: "Series ligeras para preparar el patrón motor y despertar el SNC.",
        video_id: "IZxyjW7MPJQ"
      }
    ];
  }

  private generateCooldown(): ProtocolStep[] {
    return [
      { 
        name: "Estiramiento Estático", 
        duration_min: 3, 
        description: "Enfoque en la cadena posterior y respiración diafragmática.", 
        video_id: "mYpU22_9C6Y" 
      },
      { 
        name: "Movilidad de Cadera", 
        duration_min: 2, 
        description: "Relajación del psoas e ilíaco.", 
        video_id: "LpW69H9rEEY" 
      }
    ];
  }

  private generateCardio(focus: WorkoutFocus): ProtocolStep {
    if (focus === WorkoutFocus.METABOLIC || focus === WorkoutFocus.PERFORMANCE) {
      return { 
        name: "Intervalos de Alta Intensidad", 
        duration_min: 12, 
        description: "Protocolo 30/30: 30s esfuerzo máximo / 30s recuperación.",
        video_id: "ml6cT4AZdqI"
      };
    }
    return { 
      name: "LISS (Cardio de Baja Intensidad)", 
      duration_min: 20, 
      description: "Zona 2: Caminata rápida o bicicleta suave. Ideal para recuperación activa.",
      video_id: "8fL-U0eFkMc"
    };
  }

  private generateSetsForFocus(focus: WorkoutFocus) {
    const base = { weight_kg: 0, completed: false };
    switch (focus) {
      case WorkoutFocus.STRENGTH: return Array(4).fill({ ...base, reps: 5 });
      case WorkoutFocus.HYPERTROPHY: return Array(3).fill({ ...base, reps: 12 });
      case WorkoutFocus.METABOLIC: return Array(3).fill({ ...base, reps: 15 });
      case WorkoutFocus.PERFORMANCE: return Array(4).fill({ ...base, reps: 20 });
      default: return Array(3).fill({ ...base, reps: 10 });
    }
  }
}
