import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-400 rounded-xl shadow-lg"></div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">Bienvenido de nuevo</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate gratis
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          <button className="w-full inline-flex justify-center py-3 px-4 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
            {/* ... Mismo SVG de Google que arriba ... */}
            Iniciar sesión con Google
          </button>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">O con tu correo</span></div>
          </div>

          <form className="mt-6 space-y-4">
            <input type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Correo electrónico" />
            <input type="password" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contraseña" />
            <button type="submit" className="w-full py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}