
import React from 'react';

interface LegalDisclaimerProps {
  onAccept: () => void;
}

/**
 * LegalDisclaimer component.
 * Exported both as named and default to ensure compatibility with different module resolution settings.
 */
export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ onAccept }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 md:p-12">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none mb-6">Privacidad y Seguridad</h2>
        
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed font-medium mb-10 h-64 overflow-y-auto pr-4 custom-scrollbar">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-blue-900 mb-6">
            <p className="font-black uppercase text-xs tracking-widest mb-2">Compromiso KuraFit</p>
            <p className="font-bold italic">"Los datos recogidos, incluyendo tu nombre, correo y número de celular, son estrictamente confidenciales. Garantizamos que NO venderemos ni cederemos tu información a terceros bajo ninguna circunstancia."</p>
          </div>

          <p className="font-black text-slate-900 uppercase text-xs tracking-widest">1. PROTECCIÓN DE CONTACTO Y BIOMETRÍA</p>
          <p>Tu número de celular y métricas corporales se utilizan exclusivamente para la personalización de tu plan y alertas de seguridad. El almacenamiento es seguro y privado.</p>
          
          <p className="font-black text-slate-900 uppercase text-xs tracking-widest">2. DESCARGO MÉDICO</p>
          <p>KuraFit es un motor de optimización física. No sustituye el consejo médico profesional. Ante lesiones graves, sigue siempre las pautas de tu fisioterapeuta o médico.</p>
          
          <p className="font-black text-slate-900 uppercase text-xs tracking-widest">3. RESPONSABILIDAD TÉCNICA</p>
          <p>Al aceptar, asumes la responsabilidad de ejecutar los ejercicios con la técnica sugerida. La IA ajusta el volumen pero tú controlas la ejecución.</p>
        </div>

        <button 
          onClick={onAccept}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all uppercase italic tracking-widest text-sm active:scale-95"
        >
          Acepto y Confío mi Privacidad
        </button>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
