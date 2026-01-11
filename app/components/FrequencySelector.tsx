
import React from 'react';
import { calculateRecommendedFrequency } from '../services/recommendation';
import { User } from '../types';

interface FrequencySelectorProps {
  user: User;
  onSelect: (days: number) => void;
  selectedDays: number;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ user, onSelect, selectedDays }) => {
  const recommendation = calculateRecommendedFrequency(user);
  const options = [3, 4, 5];

  const getIntensityColor = (days: number) => {
    if (days === 3) return "text-emerald-500 bg-emerald-50 border-emerald-100";
    if (days === 4) return "text-blue-500 bg-blue-50 border-blue-100";
    return "text-indigo-500 bg-indigo-50 border-indigo-100";
  };

  const showSafetyWarning = selectedDays > recommendation.days && recommendation.isRestricted;

  return (
    <div className="space-y-6">
      <div className="bg-blue-600/5 border border-blue-200 p-4 rounded-2xl flex gap-4 items-center">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Sugerencia del Coach IA</h4>
          <p className="text-blue-700 text-xs leading-relaxed">{recommendation.reason}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => {
          const isRecommended = option === recommendation.days;
          const isSelected = option === selectedDays;

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all text-left group
                ${isSelected 
                  ? 'border-blue-600 bg-white shadow-lg shadow-blue-100 ring-2 ring-blue-50' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-300'}
              `}
            >
              {isRecommended && (
                <span className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-full shadow-sm">
                  Recomendado
                </span>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${getIntensityColor(option)}`}>
                  {option === 3 ? 'Básico' : option === 4 ? 'Intenso' : 'Elite'}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-200'}`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>

              <p className="text-3xl font-black text-slate-800">{option} <span className="text-lg font-bold text-slate-400">Días</span></p>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {option === 3 ? 'Split Full Body' : option === 4 ? 'Split Torso/Pierna' : 'Split Grupos Específicos'}
              </p>
            </button>
          );
        })}
      </div>

      {showSafetyWarning && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl animate-pulse">
          <div className="flex gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-amber-800 font-bold text-sm">Aviso de Seguridad Crítico</p>
              <p className="text-amber-700 text-xs mt-1">
                Estás seleccionando una frecuencia superior a la recomendada para tu perfil médico. 
                Esto incrementa el riesgo de agravamiento de tu lesión: <strong>{user.injuries[0]?.name || 'lesión registrada'}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencySelector;
