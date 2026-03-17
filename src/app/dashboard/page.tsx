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
    <div className="mt-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20 mb-8 relative overflow-hidden transition-all-smooth hover-lift">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.nombre || 'Usuario'}</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            Sistema de administración y gestión operativa de etiquetas QR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <svg xmlns="http://www.w3.org/msqrt" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Módulo Etiquetas</h3>
            <p className="text-sm text-slate-500 mt-1">Gere y active etiquetas para el equipaje de los pasajeros.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
             <svg xmlns="http://www.w3.org/msqrt" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Impresión</h3>
            <p className="text-sm text-slate-500 mt-1">Imprima las etiquetas QR para adjuntarlas al equipaje.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
             <svg xmlns="http://www.w3.org/msqrt" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Reportes</h3>
            <p className="text-sm text-slate-500 mt-1">Consulte ventas e inventario en tiempo real.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
