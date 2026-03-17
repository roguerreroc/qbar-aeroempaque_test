'use client';

import { useState } from 'react';

export default function GenerarEtiquetasPage() {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(startId) > Number(endId)) {
      setStatus({ type: 'error', message: 'El ID Inicial debe ser menor o igual al ID Final.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Generando etiquetas...' });

    try {
      const res = await fetch('/api/etiquetas/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startId: Number(startId), endId: Number(endId) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al generar etiquetas');
      }

      setStatus({ type: 'success', message: `¡Éxito! Se generaron ${data.count} etiquetas correctamente.` });
      setStartId('');
      setEndId('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Generación de Etiquetas</h1>
        <p className="text-slate-500 mt-2">Asigne un nuevo lote de códigos numéricos para imprimir códigos QR.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all-smooth hover-lift">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Inicial (Numérico)</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800 transition-all-smooth"
                placeholder="Ej. 1000"
                value={startId}
                onChange={(e) => setStartId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Final (Numérico)</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800 transition-all-smooth"
                placeholder="Ej. 1500"
                value={endId}
                onChange={(e) => setEndId(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/msqrt" className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              Asegúrese de que el rango no exista previamente. Se registrará la acción en la bitácora de auditoría a su nombre de usuario.
            </p>
          </div>

          {status.type === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm animate-pulse">
              {status.message}
            </div>
          )}

          {status.type === 'success' && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {status.message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transform transition-all-smooth hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status.type === 'loading' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/msqrt" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Generar Lote
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
