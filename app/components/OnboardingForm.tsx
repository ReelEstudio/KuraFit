import React, { useState, useMemo } from 'react';
import { User, Difficulty, WorkoutFocus, DietType, Equipment, Injury } from '../types';
import FrequencySelector from './FrequencySelector';

interface OnboardingFormProps {
  onComplete: (userData: User) => void;
}

const steps = ['Biometría', 'Objetivo', 'Nivel', 'Estilo de Vida', 'Dieta', 'Salud', 'Frecuencia'];

const GOAL_METADATA: Record<WorkoutFocus, { title: string; desc: string; icon: string }> = {
  [WorkoutFocus.METABOLIC]: { title: "Pérdida de Grasa", desc: "Oxidación lipídica intensa.", icon: "🔥" },
  [WorkoutFocus.HYPERTROPHY]: { title: "Aumentar Músculo", desc: "Síntesis proteica máx.", icon: "💪" },
  [WorkoutFocus.STRENGTH]: { title: "Ganar Fuerza", desc: "Reclutamiento motor.", icon: "🏋️" },
  [WorkoutFocus.PERFORMANCE]: { title: "Salud y Bienestar", desc: "Longevidad sistémica.", icon: "✨" }
};

const LEVEL_METADATA: Record<Difficulty, { title: string; desc: string; icon: string; details: string }> = {
  [Difficulty.BEGINNER]: { 
    title: "Principiante", 
    icon: "🌱", 
    desc: "Menos de 6 meses de experiencia.", 
    details: "Enfoque en aprender la técnica correcta, coordinación básica y adaptación de tendones y ligamentos." 
  },
  [Difficulty.INTERMEDIATE]: { 
    title: "Intermedio", 
    icon: "⚡", 
    desc: "6 a 18 meses de entrenamiento.", 
    details: "Dominas los movimientos básicos. Buscas optimizar la fuerza y la estética con sobrecarga progresiva." 
  },
  [Difficulty.ADVANCED]: { 
    title: "Avanzado", 
    icon: "🏆", 
    desc: "Más de 18 meses constantes.", 
    details: "Alta capacidad de trabajo. Entiendes la conexión mente-músculo y manejas intensidades elevadas (RPE 8-10)." 
  }
};

const DIET_METADATA: Record<DietType, { title: string; icon: string; desc: string; foods: string }> = {
  [DietType.OMNIVORE]: { 
    title: "Dieta Balanceada", 
    icon: "🍱", 
    desc: "Comes de todo: carne, vegetales y granos.", 
    foods: "Ej: Pollo, arroz, frutas, huevos y pan integral." 
  },
  [DietType.VEGAN]: { 
    title: "100% Vegetal", 
    icon: "🌱", 
    desc: "Sin productos animales. Basada en plantas.", 
    foods: "Ej: Legumbres, tofu, frutos secos, cereales y verduras." 
  },
  [DietType.KETO]: { 
    title: "Alta en Grasas (Keto)", 
    icon: "🥓", 
    desc: "Muy pocos azúcares y harinas, muchas grasas saludables.", 
    foods: "Ej: Aguacate, carnes, pescados, frutos secos y aceites." 
  },
  [DietType.PALEO]: { 
    title: "Dieta Natural (Paleo)", 
    icon: "🍖", 
    desc: "Alimentos reales sin procesar, como nuestros ancestros.", 
    foods: "Ej: Carne magra, pescado, tubérculos, frutas y semillas." 
  },
  [DietType.VEGETARIAN]: { 
    title: "Vegetariana", 
    icon: "🥦", 
    desc: "Sin carnes ni pescados, pero incluye huevos y lácteos.", 
    foods: "Ej: Queso, huevos, lentejas, verduras y cereales." 
  }
};

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<User>>({
    full_name: '',
    email: '',
    phone: '',
    age: 25,
    weight_kg: 70,
    height_cm: 175,
    fitness_level: Difficulty.BEGINNER,
    goal: WorkoutFocus.HYPERTROPHY,
    diet: DietType.OMNIVORE,
    sleep_quality: 3,
    stress_level: 3,
    available_equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL],
    injuries: [],
    sessions_per_week: 3,
    completed_sessions_count: 0,
    session_history: []
  });

  const update = (key: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const biometryAnalysis = useMemo(() => {
    const { weight_kg, height_cm } = formData;
    if (!weight_kg || !height_cm || height_cm < 100) return null;
    
    const bmi = weight_kg / Math.pow(height_cm / 100, 2);
    let status = "Normopeso";
    let color = "bg-blue-500";

    if (bmi < 18.5) { status = "Bajo Peso"; color = "bg-amber-500"; }
    else if (bmi >= 25 && bmi < 30) { status = "Sobrepeso"; color = "bg-orange-500"; }
    else if (bmi >= 30) { status = "Obesidad"; color = "bg-red-500"; }

    return { 
      bmi: bmi.toFixed(1), 
      status, 
      color, 
      idealWeight: `${Math.round(18.5 * Math.pow(height_cm/100, 2))} - ${Math.round(24.9 * Math.pow(height_cm/100, 2))} kg`
    };
  }, [formData.weight_kg, formData.height_cm]);

  const toggleInjury = (part: string) => {
    const existing = formData.injuries || [];
    const injury = existing.find(i => i.name === part);
    if (injury) {
      update('injuries', existing.filter(i => i.name !== part));
    } else {
      update('injuries', [...existing, { 
        id: Math.random().toString(), 
        name: part, 
        details: '', 
        recovery_time: '', 
        category: 'joint', 
        is_current: true 
      }]);
    }
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));
  const handleFinish = () => onComplete(formData as User);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white md:rounded-[40px] shadow-2xl border border-slate-100 flex flex-col min-h-[600px] animate-in fade-in overflow-hidden">
      <div className="bg-slate-50 border-b p-4 md:p-6">
        <div className="flex justify-between gap-1">
          {steps.map((step, i) => (
            <div key={step} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 mb-2 ${i <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`} />
              <span className={`text-[7px] md:text-[9px] font-black uppercase block text-center truncate ${i <= currentStep ? 'text-blue-600' : 'text-slate-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
        {/* STEP 0: BIOMETRY */}
{currentStep === 0 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <header>
      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Biometría y Perfil</h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Garantía de Privacidad de Datos</p>
    </header>
    
    <div className="space-y-4">
      {/* Nombre ocupa todo el ancho */}
      <input 
        type="text" 
        placeholder="Nombre completo" 
        className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" 
        value={formData.full_name} 
        onChange={e => update('full_name', e.target.value)} 
      />
      
      {/* Teléfono ocupa todo el ancho */}
      <div className="relative">
         <input 
           type="tel" 
           placeholder="Número de Celular (Privado)" 
           className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold pl-12" 
           value={formData.phone} 
           onChange={e => update('phone', e.target.value)} 
         />
         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📱</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Edad</label>
        <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.age} onChange={e => update('age', parseInt(e.target.value))} />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Peso kg</label>
        <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.weight_kg} onChange={e => update('weight_kg', parseInt(e.target.value))} />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Altura cm</label>
        <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.height_cm} onChange={e => update('height_cm', parseInt(e.target.value))} />
      </div>
    </div>

    {biometryAnalysis && (
      <div className="bg-slate-900 p-6 rounded-[32px] text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[10px] font-black text-blue-400 uppercase">Análisis IMC</h4>
          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${biometryAnalysis.color}`}>{biometryAnalysis.status}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-[8px] text-slate-400 uppercase">IMC Actual</p><p className="text-xl font-black italic">{biometryAnalysis.bmi}</p></div>
          <div><p className="text-[8px] text-slate-400 uppercase">Rango Saludable</p><p className="text-xs font-bold text-slate-200">{biometryAnalysis.idealWeight}</p></div>
        </div>
      </div>
    )}
  </div>
)}

        {/* STEP 1: GOAL */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <header><h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Objetivo Estratégico</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(GOAL_METADATA) as WorkoutFocus[]).map(g => (
                <button key={g} onClick={() => update('goal', g)} className={`p-6 rounded-[32px] border-2 text-left transition-all ${formData.goal === g ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100'}`}>
                  <span className="text-3xl">{GOAL_METADATA[g].icon}</span>
                  <h3 className="font-black uppercase italic text-sm mt-2">{GOAL_METADATA[g].title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">{GOAL_METADATA[g].desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FITNESS LEVEL */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <header>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Nivel de Entrenamiento</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Selecciona con honestidad para tu seguridad</p>
            </header>
            <div className="space-y-4">
              {(Object.keys(LEVEL_METADATA) as Difficulty[]).map(l => (
                <button key={l} onClick={() => update('fitness_level', l)} className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-start gap-6 w-full ${formData.fitness_level === l ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100 bg-slate-50/50'}`}>
                  <span className="text-4xl shrink-0 mt-1">{LEVEL_METADATA[l].icon}</span>
                  <div>
                    <h3 className="font-black uppercase italic text-sm">{LEVEL_METADATA[l].title}</h3>
                    <p className="text-[11px] text-slate-600 font-bold leading-tight mt-1">{LEVEL_METADATA[l].desc}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-3 leading-relaxed border-t border-slate-200 pt-2">{LEVEL_METADATA[l].details}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: LIFESTYLE */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <header><h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Estilo de Vida</h2></header>
            <div className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Calidad del Sueño</label>
                    <span className="text-xl font-black text-blue-600 italic">{formData.sleep_quality}/5</span>
                  </div>
                  <input type="range" min="1" max="5" className="w-full accent-blue-600" value={formData.sleep_quality} onChange={e => update('sleep_quality', parseInt(e.target.value))} />
               </div>
               <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Nivel de Estrés Diario</label>
                    <span className="text-xl font-black text-red-600 italic">{formData.stress_level}/5</span>
                  </div>
                  <input type="range" min="1" max="5" className="w-full accent-red-600" value={formData.stress_level} onChange={e => update('stress_level', parseInt(e.target.value))} />
               </div>
            </div>
          </div>
        )}

        {/* STEP 4: DIET */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <header>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Estrategia Nutricional</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Elige la que mejor se adapte a lo que comes normalmente</p>
            </header>
            <div className="grid grid-cols-1 gap-4">
              {(Object.keys(DIET_METADATA) as DietType[]).map(d => (
                <button key={d} onClick={() => update('diet', d)} className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-start gap-6 ${formData.diet === d ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100'}`}>
                  <span className="text-4xl shrink-0 mt-1">{DIET_METADATA[d].icon}</span>
                  <div>
                    <h3 className="font-black uppercase italic text-sm">{DIET_METADATA[d].title}</h3>
                    <p className="text-[11px] text-slate-600 font-bold leading-tight mt-1">{DIET_METADATA[d].desc}</p>
                    <p className="text-[10px] text-blue-600 font-bold italic mt-2 bg-white/50 p-2 rounded-xl inline-block">{DIET_METADATA[d].foods}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: HEALTH & SAFETY */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <header>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Salud y Seguridad</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Selecciona por Secciones Corporales</p>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Hombros', 'Codos', 'Espalda Baja', 'Rodillas', 'Tobillos', 'Cuello', 'Muñecas', 'Core'].map(p => {
                const injury = formData.injuries?.find(i => i.name === p);
                return (
                  <div key={p} className="space-y-2">
                    <button onClick={() => toggleInjury(p)} className={`w-full p-4 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${injury ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{p}</button>
                    {injury && (
                      <div className="p-4 bg-orange-50 rounded-2xl space-y-3 border border-orange-100">
                        <input type="text" placeholder="Detalle (Ej: Tendinitis)" className="w-full p-3 bg-white rounded-xl text-[10px] font-bold" value={injury.details} onChange={e => {
                          const next = formData.injuries?.map(i => i.name === p ? { ...i, details: e.target.value } : i);
                          update('injuries', next);
                        }} />
                        <input type="text" placeholder="Tiempo (Ej: 3 meses)" className="w-full p-3 bg-white rounded-xl text-[10px] font-bold" value={injury.recovery_time} onChange={e => {
                          const next = formData.injuries?.map(i => i.name === p ? { ...i, recovery_time: e.target.value } : i);
                          update('injuries', next);
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: FREQUENCY */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <header><h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Frecuencia Semanal</h2></header>
            <FrequencySelector user={formData as User} selectedDays={formData.sessions_per_week || 3} onSelect={d => update('sessions_per_week', d)} />
          </div>
        )}
      </div>

      <footer className="p-6 md:p-8 bg-slate-50 border-t flex justify-between items-center">
        <button onClick={prev} disabled={currentStep === 0} className="px-6 py-4 text-slate-400 font-black text-xs uppercase disabled:opacity-0">Atrás</button>
        {currentStep === steps.length - 1 ? (
          <button onClick={handleFinish} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase italic tracking-widest text-sm">FINALIZAR PERFIL</button>
        ) : (
          <button onClick={next} className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase italic tracking-widest text-sm">Continuar</button>
        )}
      </footer>
    </div>
  );
};

export default OnboardingForm;
