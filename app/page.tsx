import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Aquí puedes poner tu logo <img src="/logo.png" className="h-8" /> */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-400 rounded-lg"></div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Kura<span className="text-blue-600">Fit</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            Ingresar
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 pt-16 pb-24 md:px-12 md:pt-32 text-center overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-400 blur-[120px] rounded-full"></div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Tu cuerpo, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
            optimizado por IA
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Entrenamientos de alto rendimiento con bioseguridad activa. La ciencia del fitness en la palma de tu mano.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition transform shadow-xl shadow-blue-200">
            Empezar mi transformación
          </Link>
          <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition">
            Ver demostración
          </button>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="px-6 py-20 bg-slate-50 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">IA Adaptativa</h3>
            <p className="text-slate-500">Rutinas que evolucionan según tu progreso real y fatiga diaria.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Bioseguridad</h3>
            <p className="text-slate-500">Algoritmos diseñados para prevenir lesiones y optimizar la recuperación.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zM9 19h6m-6 0l6-6m0 0v6a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2zm0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Análisis Total</h3>
            <p className="text-slate-500">Métricas avanzadas de fuerza, volumen y progresión por grupo muscular.</p>
          </div>
        </div>
      </section>
    </div>
  );
}