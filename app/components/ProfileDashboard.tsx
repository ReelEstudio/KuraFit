
import React, { useState, useMemo } from 'react';
import { User, MetricEntry, DietType, WorkoutFocus } from '../types';

interface ProfileDashboardProps {
  user: User;
  onAddMetric: (metric: MetricEntry) => void;
}

const DIET_DETAILS: Record<DietType, { title: string; desc: string; example: string }> = {
  [DietType.OMNIVORE]: { 
    title: "Dieta Balanceada (Omnívora)",
    desc: "Incluye todos los grupos de alimentos sin restricciones. Proporciona un balance óptimo de micro y macronutrientes esenciales.",
    example: "Pollo a la plancha, arroz integral, brócoli al vapor y una pieza de fruta con un puñado de nueces."
  },
  [DietType.VEGAN]: { 
    title: "Dieta 100% Vegetal (Vegana)",
    desc: "Excluye todos los productos de origen animal. Se enfoca en proteínas vegetales de alta calidad, fibra y fitonutrientes.",
    example: "Bowl de quinoa con garbanzos, aguacate, espinacas frescas, semillas de cáñamo y aliño de tahini."
  },
  [DietType.KETO]: { 
    title: "Dieta Cetogénica (Keto)",
    desc: "Muy baja en carbohidratos y alta en grasas saludables. El objetivo es inducir el estado metabólico de cetosis.",
    example: "Salmón al horno con espárragos salteados en mantequilla clarificada y huevos revueltos con bacon y aguacate."
  },
  [DietType.PALEO]: { 
    title: "Dieta Evolutiva (Paleo)",
    desc: "Basada en alimentos enteros similares a los que se consumían en la era paleolítica: carnes, pescados, frutas y verduras.",
    example: "Solomillo de ternera con puré de boniato, ensalada de rúcula con piñones y frutos rojos de postre."
  },
  [DietType.VEGETARIAN]: { 
    title: "Dieta Lacto-Ovo Vegetariana",
    desc: "No incluye carnes ni pescados, pero permite huevos y lácteos para asegurar una ingesta completa de aminoácidos.",
    example: "Omelette de tres claras con queso feta, champiñones, espinacas y una rebanada de pan de centeno integral."
  }
};

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ user, onAddMetric }) => {
  const [newWeight, setNewWeight] = useState(user.weight_kg.toString());
  const [newFat, setNewFat] = useState('20');
  const [newMuscle, setNewMuscle] = useState('35');
  const [showForm, setShowForm] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'weight' | 'fat' | 'muscle' | 'bmi'>('weight');

  const currentMetric = user.metrics_history[0] || { weight_kg: user.weight_kg, body_fat_pct: 20, muscle_mass_kg: 35 };
  const bmiVal = (currentMetric.weight_kg / Math.pow(user.height_cm / 100, 2)).toFixed(1);

  const calculateIdeals = useMemo(() => {
    const h = user.height_cm / 100;
    const minWeight = Math.round(18.5 * Math.pow(h, 2));
    const maxWeight = Math.round(24.9 * Math.pow(h, 2));
    
    return {
      weight: `${minWeight} - ${maxWeight} kg`,
      fat: user.age > 40 ? "15 - 22%" : "10 - 18%",
      muscle: `${Math.round(currentMetric.weight_kg * 0.42)} kg+`,
      bmi: "18.5 - 24.9"
    };
  }, [user.height_cm, user.age, currentMetric.weight_kg]);

  const metricDetails = {
    weight: { title: "Peso Corporal", icon: "⚖️", rep: "Masa total sistémica.", impact: "Optimiza la eficiencia mecánica y salud articular.", ideal: calculateIdeals.weight, current: `${currentMetric.weight_kg} kg` },
    fat: { title: "Grasa Corporal", icon: "🔥", rep: "Tejido adiposo esencial.", impact: "Mejora el ratio potencia-peso y salud metabólica.", ideal: calculateIdeals.fat, current: `${currentMetric.body_fat_pct}%` },
    muscle: { title: "Masa Muscular", icon: "💪", rep: "Tejido contráctil activo.", impact: "Eleva el metabolismo basal y la fuerza absoluta.", ideal: calculateIdeals.muscle, current: `${currentMetric.muscle_mass_kg} kg` },
    bmi: { title: "IMC", icon: "📊", rep: "Relación peso/altura.", impact: "Indicador general de salud y riesgo sistémico.", ideal: calculateIdeals.bmi, current: bmiVal }
  };

  const activeInfo = metricDetails[activeChartMetric];

  const getMetricColor = () => {
    switch (activeChartMetric) {
      case 'weight': return '#2563eb';
      case 'fat': return '#f97316';
      case 'muscle': return '#059669';
      default: return '#475569';
    }
  };

  const handleSubmitMetric = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMetric({ 
      date: new Date(), 
      weight_kg: parseFloat(newWeight), 
      body_fat_pct: parseFloat(newFat), 
      muscle_mass_kg: parseFloat(newMuscle) 
    });
    setShowForm(false);
  };

  const historyForChart = useMemo(() => [...user.metrics_history].reverse().slice(-10), [user.metrics_history]);

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
    const padding = range * 0.2;
    return { 
      points: values.map((val, i) => ({ x: (i / (values.length - 1)) * 100, y: 100 - ((val - (min - padding)) / (range + padding * 2)) * 100, val, original: historyForChart[i] })), 
      max, min 
    };
  }, [historyForChart, activeChartMetric]);

  const injuryBioSecurity = useMemo(() => {
    if (!user.injuries || user.injuries.length === 0) return null;
    return user.injuries.map(injury => {
      const name = injury.name.toLowerCase();
      let baseAdvice = "Mantener técnica estricta, tempo controlado y control motor absoluto en cada repetición.";
      
      if (name.includes('rodilla')) {
        baseAdvice = "Protocolo de Rodilla: Evitar bloqueos articulares en extensión máxima. Priorizar Rango de Movimiento (ROM) parcial controlado si detectas molestias agudas. Enfoque en control del valgo.";
      } else if (name.includes('hombro')) {
        baseAdvice = "Protocolo de Hombro: Mantener codos a 45° respecto al torso en ejercicios de empuje. Priorizar retracción y depresión escapular constante para proteger el espacio subacromial.";
      } else if (name.includes('espalda') || name.includes('lumbar')) {
        baseAdvice = "Protocolo de Columna: Prohibida la flexión lumbar bajo carga. Implementar técnica de 'Bracing' abdominal rígido. Evitar cizallamiento vertebral mediante control de pelvis neutra.";
      } else if (name.includes('codo')) {
        baseAdvice = "Protocolo de Codo: Evitar hiperextensión. Mantener tensión constante en la musculatura adyacente. Revisar agarres para evitar epicondilitis mecánica.";
      } else if (name.includes('tobillo')) {
        baseAdvice = "Protocolo de Tobillo: Asegurar estabilidad propioceptiva. Evitar colapso del arco plantar. Controlar la dorsiflexión extrema si existe pinzamiento anterior.";
      } else if (name.includes('muñeca')) {
        baseAdvice = "Protocolo de Muñeca: Utilizar agarres neutros cuando sea posible. Evitar hiperextensión bajo cargas altas. Considerar uso de muñequeras de soporte preventivo.";
      } else if (name.includes('cuello')) {
        baseAdvice = "Protocolo Cervical: Mantener columna neutra. Evitar protraer la cabeza en esfuerzos máximos. Relajar trapecio superior en movimientos de tirón.";
      }

      const finalAdvice = injury.details 
        ? `${baseAdvice} Consideración adicional por detalle registrado: ${injury.details}.` 
        : baseAdvice;

      return { 
        part: injury.name, 
        detail: injury.details, 
        duration: injury.recovery_time, 
        advice: finalAdvice 
      };
    });
  }, [user.injuries]);

  const totalSessions = user.completed_sessions_count + (user.early_finished_count || 0);
  const adherenceRatio = totalSessions === 0 ? 0 : user.completed_sessions_count / totalSessions;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 uppercase italic shadow-xl">{user.full_name.charAt(0)}</div>
          <h3 className="font-black text-slate-900 uppercase italic mb-6 tracking-tighter truncate w-full text-center">{user.full_name}</h3>
          
          <div className="w-full space-y-3 mb-6">
            <div className="bg-emerald-600 p-4 rounded-2xl text-center shadow-lg shadow-emerald-100">
              <p className="text-[8px] font-black text-emerald-100 uppercase tracking-widest mb-1">Completadas</p>
              <p className="text-3xl font-black text-white italic leading-none">{user.completed_sessions_count}</p>
            </div>
            <div className="bg-orange-500 p-4 rounded-2xl text-center shadow-lg shadow-orange-100">
              <p className="text-[8px] font-black text-orange-100 uppercase tracking-widest mb-1">Terminadas Antes</p>
              <p className="text-3xl font-black text-white italic leading-none">{user.early_finished_count || 0}</p>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-400">Nivel IA</span><span className="text-blue-600 italic">{user.fitness_level}</span></div>
            <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-400">Lesiones</span><span className="text-orange-500">{user.injuries.length} Activas</span></div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(metricDetails) as Array<keyof typeof metricDetails>).map(key => {
              const stat = metricDetails[key];
              return (
                <button 
                  key={key} 
                  onClick={() => setActiveChartMetric(key)} 
                  className={`p-5 rounded-[32px] border transition-all text-left group hover:scale-[1.02] ${activeChartMetric === key ? 'border-blue-500 ring-4 ring-blue-50 bg-white shadow-xl' : 'bg-white border-slate-100 shadow-sm opacity-80'}`}
                >
                  <span className="text-xl">{stat.icon}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.title}</p>
                  <p className={`text-xl font-black italic leading-none mt-1 ${activeChartMetric === key ? 'text-blue-600' : 'text-slate-900'}`}>{stat.current}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden transition-all shadow-2xl border border-slate-800">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{activeInfo.icon}</span>
                      <h4 className="text-xl font-black italic uppercase leading-none">{activeInfo.title}</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[8px] uppercase font-black text-blue-400 mb-1">Valor Actual</p>
                        <p className="text-xl font-black italic text-white leading-none">{activeInfo.current}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[8px] uppercase font-black text-emerald-400 mb-1">Rango Ideal</p>
                        <p className="text-xl font-black italic text-white leading-none">{activeInfo.ideal}</p>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col justify-end gap-3">
                   <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/15 transition-all">
                      <div><p className="text-[8px] uppercase font-black text-red-400">Estrés Sistema</p><p className="text-lg font-black italic">Nivel {user.stress_level}/5</p></div>
                      <div className={`w-2 h-2 rounded-full ${user.stress_level > 3 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                   </div>
                   <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/15 transition-all">
                      <div><p className="text-[8px] uppercase font-black text-emerald-400">Calidad Sueño</p><p className="text-lg font-black italic">Nivel {user.sleep_quality}/5</p></div>
                      <div className={`w-2 h-2 rounded-full ${user.sleep_quality < 3 ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[40px] shadow-inner">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-orange-200 rounded-2xl text-orange-700 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
               <div><h3 className="text-sm font-black text-orange-900 uppercase italic tracking-tighter leading-none">Protocolo de Bioseguridad Activa</h3><p className="text-[10px] text-orange-600 font-bold uppercase mt-1">Gestión IA de Limitaciones y Precauciones</p></div>
            </div>
            {injuryBioSecurity ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {injuryBioSecurity.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-orange-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">{item.part}</p>
                        </div>
                        <span className="text-[8px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.duration || 'Reportado'}</span>
                     </div>
                     <div className="flex-1">
                        <div className="pt-3 border-t border-orange-50">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             Precaución del Sistema
                           </p>
                           <p className="text-xs font-bold text-slate-700 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{item.advice}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-emerald-50 rounded-[32px] border-2 border-dashed border-emerald-200 flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-[12px] font-black text-emerald-700 uppercase italic tracking-widest">Atleta Íntegro</p>
                <p className="text-[10px] font-bold text-emerald-600/70 uppercase">No se detectan compromisos articulares. Máxima capacidad operativa.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div><h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Evolución Cronológica</h3></div>
              <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">{showForm ? 'Cerrar' : 'Nuevo Registro'}</button>
            </div>
            {showForm ? (
              <form onSubmit={handleSubmitMetric} className="flex-1 space-y-4 max-w-sm mx-auto w-full animate-in zoom-in-95 py-10">
                <div className="grid grid-cols-1 gap-3">
                  <input type="number" step="0.1" placeholder="Peso kg" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-blue-600 outline-none border border-slate-100" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                  <input type="number" step="0.1" placeholder="% Grasa" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-orange-600 outline-none border border-slate-100" value={newFat} onChange={e => setNewFat(e.target.value)} />
                  <input type="number" step="0.1" placeholder="Músculo kg" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-emerald-600 outline-none border border-slate-100" value={newMuscle} onChange={e => setNewMuscle(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl uppercase italic mt-4">Sincronizar Métricas</button>
              </form>
            ) : (
              <div className="flex-1 min-h-[250px] relative mt-4">
                {chartData ? (
                  <div className="w-full h-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d={`M ${chartData.points.map(p => `${p.x} ${p.y}`).join(' L ')}`} fill="none" stroke={getMetricColor()} strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                ) : (
                   <p className="text-center text-slate-300 py-20 uppercase font-black text-[10px] tracking-widest">Registra tus métricas para iniciar trazabilidad</p>
                )}
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-slate-50 animate-in slide-in-from-bottom-4">
               <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Evolución del Entrenamiento (Sesiones)</h4>
               <div className="flex items-center gap-6">
                  <div className="flex-1">
                     <div className="flex justify-between text-[10px] font-black uppercase mb-2"><span>Adherencia al Plan</span><span className="text-blue-600">{Math.round(adherenceRatio * 100)}%</span></div>
                     <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${adherenceRatio * 100}%` }} />
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status de Rendimiento</p>
                     <p className="text-sm font-black text-slate-900 italic uppercase">{adherenceRatio > 0.85 ? 'Elite' : adherenceRatio > 0.6 ? 'Constante' : 'Iniciando'}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 flex flex-col">
          <h3 className="text-sm font-black text-slate-900 uppercase italic leading-none mb-2 tracking-tighter">Plan Nutricional IA</h3>
          {user.nutrition ? (
            <div className="space-y-6 flex-1">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden group">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Estrategia Activa</p>
                 </div>
                 <p className="text-lg font-black text-blue-600 uppercase italic leading-none tracking-tighter mb-4">{DIET_DETAILS[user.diet].title}</p>
                 
                 <div className="space-y-4">
                    <div>
                       <p className="text-[8px] font-black uppercase text-blue-800/60 mb-1">¿De qué trata esta dieta?</p>
                       <p className="text-[11px] font-bold text-blue-900 leading-relaxed italic">{DIET_DETAILS[user.diet].desc}</p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-2xl border border-blue-200 shadow-sm">
                       <p className="text-[8px] font-black uppercase text-blue-800/60 mb-1">Ejemplo de Menú Sugerido</p>
                       <p className="text-[10px] font-bold text-blue-800 leading-relaxed italic">"{DIET_DETAILS[user.diet].example}"</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Proteína', val: user.nutrition.protein_g, color: 'bg-blue-600', max: 200, icon: '🥩' }, 
                  { label: 'Carbos', val: user.nutrition.carbs_g, color: 'bg-emerald-500', max: 400, icon: '🍝' }, 
                  { label: 'Grasas', val: user.nutrition.fats_g, color: 'bg-orange-500', max: 100, icon: '🥑' }
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                      <span className="text-slate-400 flex items-center gap-1">{m.icon} {m.label}</span>
                      <span className="text-slate-900">{m.val}g</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100"><div className={`h-full ${m.color} transition-all duration-1000`} style={{ width: `${Math.min((m.val / m.max) * 100, 100)}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 text-center mt-auto bg-slate-50 -mx-8 -mb-8 p-8 rounded-b-[40px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Límite Calórico Diario</p>
                <p className="text-4xl font-black italic text-slate-900 leading-none tracking-tighter">{user.nutrition.calories}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Basado en objetivo: {user.goal}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-300">
               <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               <p className="text-[10px] font-black uppercase tracking-widest">Plan No Calculado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
