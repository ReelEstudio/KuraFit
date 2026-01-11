'use client';
import React, { useState } from 'react';
import { User, DietType, Difficulty, Equipment, WorkoutFocus } from '../types';

const OnboardingForm = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    goal: '',
    diet_type: DietType.OMNIVORE,
    level: Difficulty.BEGINNER,
    available_equipment: [Equipment.BODYWEIGHT]
  });

  const handleNext = () => {
    if (step === 3) {
      onComplete(formData);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="bg-white rounded-[60px] p-12 max-w-2xl w-full shadow-2xl border border-slate-100">
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 mx-2 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Tu Nombre</h2>
            <input 
              className="w-full p-6 bg-slate-50 rounded-[30px] text-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all"
              placeholder="Escribe aquí..."
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Tipo de Dieta</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.values(DietType).map((type) => (
                <button 
                  key={type}
                  onClick={() => setFormData({...formData, diet_type: type})}
                  className={`p-6 rounded-[30px] text-left font-black italic uppercase transition-all ${formData.diet_type === type ? 'bg-[#1a1f2e] text-white' : 'bg-slate-50 text-slate-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Nivel de Atleta</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.values(Difficulty).map((lvl) => (
                <button 
                  key={lvl}
                  onClick={() => setFormData({...formData, level: lvl})}
                  className={`p-6 rounded-[30px] text-left font-black italic uppercase transition-all ${formData.level === lvl ? 'bg-[#1a1f2e] text-white' : 'bg-slate-50 text-slate-400'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          className="w-full mt-12 bg-blue-600 text-white p-8 rounded-[35px] text-xl font-black italic uppercase shadow-xl hover:scale-105 transition-all"
        >
          {step === 3 ? 'FINALIZAR' : 'CONTINUAR →'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;