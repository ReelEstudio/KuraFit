import React, { useState, useMemo } from 'react';
import { User, MetricEntry, DietType } from '../types';

interface ProfileDashboardProps {
  user: User;
  onAddMetric: (metric: MetricEntry) => void;
}

const DIET_DETAILS: Record<string, { title: string; desc: string; example: string }> = {
  [DietType.OMNIVORE]: { 
    title: "Dieta Balanceada (Omnívora)",
    desc: "Incluye todos los grupos de alimentos sin restricciones.",
    example: "Pollo a la plancha, arroz integral y brócoli."
  },
  [DietType.VEGAN]: { 
    title: "Dieta 100% Vegetal (Vegana)",
    desc: "Excluye todos los productos de origen animal.",
    example: "Bowl de quinoa con garbanzos y aguacate."
  },
  [DietType.KETO]: { 
    title: "Dieta Cetogénica (Keto)",
    desc: "Muy baja en carbohidratos y alta en grasas saludables.",
    example: "Salmón al horno con espárragos y aguacate."
  },
  [DietType.PALEO]: { 
    title: "Dieta Evolutiva (Paleo)",
    desc: "Basada en alimentos enteros y carnes.",
    example: "Solomillo de ternera con puré de boniato."
  },
  [DietType.VEGETARIAN]: { 
    title: "Dieta Lacto-Ovo Vegetariana",
    desc: "No incluye carnes, pero permite huevos y lácteos.",
    example: "Omelette de tres claras con queso feta y espinacas."
  }
};

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ user, onAddMetric }) => {
  const [newWeight, setNewWeight] = useState(user?.weight_kg?.toString() || '70');
  const [newFat, setNewFat] = useState('20');
  const [newMuscle, setNewMuscle] = useState('35');
  const [showForm, setShowForm] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'weight' | 'fat' | 'muscle' | 'bmi'>('weight');

  // 1. MÉTRICAS PROTEGIDAS
  const currentMetric = useMemo(() => {
    return user?.metrics_history?.[0] || { 
      weight_kg: user?.weight_kg || 70, 
      body_fat_pct: 20, 
      muscle_mass_kg: 35 
    };
  }, [user]);

  const bmiVal = useMemo(() => {
    const h = (user?.height_cm || 175) / 100;
    return (currentMetric.weight_kg / (h * h)).toFixed(1);
  }, [currentMetric.weight_kg, user?.height_cm]);

  const calculateIdeals = useMemo(() => {
    const h = (user?.height_cm || 175) / 100;
    return {
      weight: `${Math.round(18.5 * h * h)} - ${Math.round(24.9 * h * h)} kg`,
      fat: (user?.age || 30) > 40 ? "15 - 22%" : "10 - 18%",
      muscle: `${Math.round(currentMetric.weight_kg * 0.42)} kg+`,
      bmi: "18.5 - 24.9"
    };
  }, [user?.height_cm, user?.age, currentMetric.weight_kg]);

  const metricDetails = {
    weight: { title: "Peso", icon: "⚖️", ideal: calculateIdeals.weight, current: `${currentMetric.weight_kg} kg` },
    fat: { title: "Grasa", icon: "🔥", ideal: calculateIdeals.fat, current: `${currentMetric.body_fat_pct}%` },
    muscle: { title: "Músculo", icon: "💪", ideal: calculateIdeals.muscle, current: `${currentMetric.muscle_mass_kg} kg` },
    bmi: { title: "IMC", icon: "📊", ideal: calculateIdeals.bmi, current: bmiVal }
  };

  const activeInfo = metricDetails[activeChartMetric];

  // 2. DIETA PROTEGIDA (Evita error si user.diet es null)
  const dietInfo = useMemo(() => {
    const dietKey = user?.diet || DietType.OMNIVORE;
    return DIET_DETAILS[dietKey] || DIET_DETAILS[DietType.OMNIVORE];
  }, [user?.diet]);

  const historyForChart = useMemo(() => {
    const history = Array.isArray(user?.metrics_history) ? user.metrics_history : [];
    return [...history].reverse().slice(-10);
  }, [user?.metrics_history]);

  const chartData = useMemo(() => {
    if (historyForChart.length < 2 || activeChartMetric === 'bmi') return null;
    const values = historyForChart.map(m => {
      if (activeChartMetric === 'weight') return m.weight_kg;
      if (activeChartMetric === 'fat') return m.body_fat_pct || 0;
      return m.muscle_mass_kg || 0;
    });
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return { 
      points: values.map((val, i) => ({ 
        x: (i / (values.length - 1)) * 100, 
        y: 100 - ((val - (min * 0.95)) / (range * 1.1)) * 100
      }))
    };
  }, [historyForChart, activeChartMetric]);

  const totalSessions = (user?.completed_sessions_count || 0) + (user?.early_finished_count || 0);
  const adherenceRatio = totalSessions === 0 ? 0 : (user?.completed_sessions_count || 0) / totalSessions;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 uppercase italic">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <h3 className="font-black text-slate-900 uppercase italic mb-6 tracking-tighter truncate w-full text-center">
            {user?.full_name || 'Atleta'}
          </h3>
          <div className="w-full space-y-3">
            <div className="bg-emerald-600 p-4 rounded-2xl text-center">
              <p className="text-[8px] font-black text-emerald-100 uppercase mb-1">Sesiones</p>
              <p className="text-3xl font-black text-white italic">{user?.completed_sessions_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(metricDetails) as Array<keyof typeof metricDetails>).map(key => (
              <button key={key} onClick={() => setActiveChartMetric(key)} className={`p-5 rounded-[32px] border transition-all text-left ${activeChartMetric === key ? 'border-blue-500 ring-4 ring-blue-50 bg-white' : 'bg-white border-slate-100'}`}>
                <span className="text-xl">{metricDetails[key].icon}</span>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-2">{metricDetails[key].title}</p>
                <p className="text-xl font-black italic text-slate-900">{metricDetails[key].current}</p>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h4 className="text-xl font-black italic uppercase mb-4">{activeInfo.title}</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[8px] uppercase font-black text-blue-400">Actual</p>
                        <p className="text-xl font-black italic">{activeInfo.current}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[8px] uppercase font-black text-emerald-400">Ideal</p>
                        <p className="text-xl font-black italic">{activeInfo.ideal}</p>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col justify-end gap-3">
                   <div className="bg-white/10 px-4 py-3 rounded-xl flex justify-between items-center">
                      <p className="text-xs font-black italic uppercase">Estrés: {user?.stress_level || 3}/5</p>
                      <div className={`w-2 h-2 rounded-full ${(user?.stress_level || 0) > 3 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
                   </div>
                   <div className="bg-white/10 px-4 py-3 rounded-xl flex justify-between items-center">
                      <p className="text-xs font-black italic uppercase">Sueño: {user?.sleep_quality || 3}/5</p>
                      <div className={`w-2 h-2 rounded-full ${(user?.sleep_quality || 0) < 3 ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic">Evolución</h3>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">
              {showForm ? 'Cerrar' : 'Nuevo'}
            </button>
          </div>
          
          <div className="h-[200px] flex items-center justify-center">
            {chartData ? (
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d={`M ${chartData.points.map(p => `${p.x} ${p.y}`).join(' L ')}`} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <p className="text-[10px] font-black text-slate-300 uppercase italic">Sin datos suficientes</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase italic mb-6">Nutrición IA</h3>
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
               <p className="text-lg font-black text-blue-600 uppercase italic">{dietInfo.title}</p>
               <p className="text-[10px] font-bold text-blue-800 italic mt-2">"{dietInfo.example}"</p>
            </div>
            {user?.nutrition && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Kcal</p>
                  <p className="text-lg font-black text-slate-900 italic">{user.nutrition.calories}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Proteína</p>
                  <p className="text-lg font-black text-slate-900 italic">{user.nutrition.protein_g}g</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;