import { readCSV } from '@/lib/csv';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicEtiquetaPage({ params }: PageProps) {
  // Await params per Next.js 15+ convention for dynamic routes
  const { id } = await params;

  const etiquetas = await readCSV<any>('etiquetas.csv');
  const etiqueta = etiquetas.find((e) => e.id === id);

  if (!etiqueta) {
    notFound();
  }

  const activaciones = await readCSV<any>('activaciones.csv');
  // Buscar la activación activa más reciente para esta etiqueta
  const tagActivations = activaciones.filter((a) => a.etiquetaId === id);
  const currentActivacion = tagActivations[tagActivations.length - 1]; // Toma la última

  // Tipos
  const tipos = await readCSV<any>('tipos_equipaje.csv');
  const tipo = currentActivacion ? tipos.find((t) => t.id === currentActivacion.tipoEquipajeId) : null;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans flex items-start justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative flex justify-between items-center">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full filter blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">AEROEMPAQUE</h1>
            <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mt-1">Status Equipaje</p>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {etiqueta.estado === 'activa' && currentActivacion ? (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 border-b-2 border-dashed border-slate-200 pb-8">
              <div className="text-center">
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{currentActivacion.vueloOrigen}</p>
                <p className="text-xs text-slate-400 font-medium uppercase mt-2">Origen</p>
              </div>
              <div className="flex flex-col items-center justify-center text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{currentActivacion.vueloDestino}</p>
                <p className="text-xs text-slate-400 font-medium uppercase mt-2">Destino</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-2">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">PNR Reserva</p>
                <p className="text-lg font-bold text-slate-800 font-mono">{currentActivacion.reserva}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Tipo Equipaje</p>
                <p className="text-sm font-bold text-slate-800 bg-slate-100 inline-block px-3 py-1 rounded-full">{tipo?.nombre || 'General'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Fecha de Viaje</p>
                <p className="text-sm font-bold text-slate-800">{new Date(currentActivacion.fechaInicio).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Etiqueta ID</p>
                <p className="text-sm font-bold text-slate-800 font-mono">#{id}</p>
              </div>
            </div>
            
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex shrink-0 items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
              </div>
              <p className="text-sm font-medium text-green-800">Equipaje validado y en tránsito activo hacia el destino final.</p>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50">
             <div className="w-20 h-20 bg-slate-200 rounded-full flex justify-center items-center mx-auto mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Equipaje Inactivo</h2>
             <p className="text-slate-500 text-sm leading-relaxed">Esta etiqueta (#{id}) no está asignada a ningún vuelo activo actualmente o su validez ya expiró.</p>
          </div>
        )}
        
        {/* Footer */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-slate-400 text-xs">
           <span>AEROEMPAQUE QR VERIFICATION SYSTEMS</span>
           <span className="font-mono">SYS-OK</span>
        </div>
      </div>
    </div>
  );
}
