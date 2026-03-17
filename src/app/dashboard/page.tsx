'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    // Lazy sweep for expired tags
    fetch('/api/etiquetas/clean').catch(() => {});
  }, []);

  return (
    <div className="mt-4 lg:mt-8">
      <div className="bg-gradient-to-r from-[#3CC879] to-[#2DA661] rounded-3xl p-6 lg:p-8 text-white shadow-[0_15px_40px_rgba(60,200,121,0.25)] mb-8 relative overflow-hidden transition-all-smooth hover-lift">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute left-[-20px] bottom-[-50px] w-40 h-40 bg-[#FCE14B] opacity-20 rounded-full filter blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Bienvenido, {user?.nombre || 'Usuario'}</h1>
          <p className="text-white/90 max-w-2xl text-base lg:text-lg">
            Sistema de administración y gestión operativa de etiquetas QR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex items-start gap-4 transition-all-smooth hover:-translate-y-1">
          <div className="p-3 bg-[#E8F8EE] text-[#3CC879] rounded-2xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Módulo Etiquetas</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Genere y active etiquetas para el equipaje de los pasajeros.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex items-start gap-4 transition-all-smooth hover:-translate-y-1">
          <div className="p-3 bg-[#FFF9CC] text-[#D4B300] rounded-2xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Impresión</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Imprima las etiquetas QR generadas de forma masiva en PDF.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex items-start gap-4 transition-all-smooth hover:-translate-y-1">
          <div className="p-3 bg-orange-50 text-[#ED7044] rounded-2xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Reportes</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Consulte el estado de ventas e inventario en tiempo real.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
