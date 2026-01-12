'use client';
import React from 'react';
import { User } from '../types';

interface FrequencySelectorProps {
  user: User;
  onSelect: (freq: number) => void;
  selectedFreq: number;
}

const FrequencySelector = ({ user, onSelect, selectedFreq }: FrequencySelectorProps) => {
  const frequencies = [2, 3, 4, 5, 6];

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter">Frecuencia Semanal</h2>
      <div className="grid grid-cols-5 gap-4">
        {frequencies.map((f) => (
          <button
            key={f}
            onClick={() => onSelect(f)}
            className={`p-6 rounded-[25px] font-black text-2xl transition-all ${
              selectedFreq === f ? 'bg-[#1a1f2e] text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {selectedFreq > 4 && user.injuries && user.injuries.length > 0 && (
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-[30px] flex gap-4 items-center animate-pulse">
          <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold">!</div>
          <p className="text-amber-700 text-xs font-medium leading-relaxed">
            Aviso de Seguridad Crítico: Estás seleccionando una frecuencia superior a la recomendada para tu perfil médico. 
            Esto incrementa el riesgo de agravamiento de tu lesión: <b className="uppercase font-black">{user.injuries[0].name}</b>.
          </p>
        </div>
      )}
    </div>
  );
};

export default FrequencySelector;