'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export default function ImprimirEtiquetasPage() {
  const [etiquetas, setEtiquetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    fetch('/api/etiquetas')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filtramos solo las inactivas (sin asignar, listas para imprimir)
          const validas = data.etiquetas.filter((e: any) => e.estado === 'inactiva');
          setEtiquetas(validas);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === etiquetas.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(etiquetas.map(e => e.id));
    }
  };

  const handleImprimir = async () => {
    if (selectedIds.length === 0) return;
    
    setStatus({ type: 'loading', message: 'Generando documento PDF, por favor espere...' });
    
    try {
      // Configuramos PDF para formato de etiqueta pequeña (ej. 4x6 pulgadas ~ 100x150 mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150]
      });

      for (let i = 0; i < selectedIds.length; i++) {
        const id = selectedIds[i];
        
        // El contenido del QR será la URL pública de la etiqueta
        // En producción se usaría la URL real del dominio
        const host = typeof window !== 'undefined' ? window.location.origin : 'https://aeroempaque.com';
        const urlPública = `${host}/etiqueta/${id}`;
        
        // Generar QR en DataURL
        const qrDataUrl = await QRCode.toDataURL(urlPública, {
          width: 300,
          margin: 1,
          color: {
            dark: '#1e293b', // Tailwind slate-800
            light: '#ffffff'
          }
        });

        if (i > 0) {
          pdf.addPage([100, 150], 'portrait');
        }

        // Diseño de la Etiqueta
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, 100, 150, 'F');
        
        // Cabecera Aerolínea
        pdf.setFillColor(37, 99, 235); // Blue-600
        pdf.rect(0, 0, 100, 25, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("AEROEMPAQUE QR", 50, 15, { align: "center" });
        
        // Código QR en el centro
        pdf.addImage(qrDataUrl, 'PNG', 15, 35, 70, 70);
        
        // Instrucciones
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Escanee para ver detalles del equipaje", 50, 115, { align: "center" });
        
        // ID Número
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(`TAG ID: ${id}`, 50, 130, { align: "center" });
        
        // Borde decorativo
        pdf.setDrawColor(203, 213, 225); // Slate-300
        pdf.setLineWidth(0.5);
        pdf.line(10, 140, 90, 140);
        
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        pdf.text("Gracias por volar con nosotros", 50, 145, { align: "center" });
      }

      // Descargar el PDF
      pdf.save(`Etiquetas_Equipaje_${Date.now()}.pdf`);
      setStatus({ type: 'success', message: 'PDF generado y descargado correctamente.' });
      
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'Hubo un error al generar los códigos QR.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-6 border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Impresión de Etiquetas</h1>
          <p className="text-slate-500 mt-1">Seleccione los rangos generados para exportar e imprimir.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            {selectedIds.length === etiquetas.length && etiquetas.length > 0 ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
          </button>
          <button
            onClick={handleImprimir}
            disabled={selectedIds.length === 0 || status.type === 'loading'}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all-smooth disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Imprimir ({selectedIds.length})
          </button>
        </div>
      </div>

      {status.type === 'error' && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm animate-pulse">
          {status.message}
        </div>
      )}

      {status.type === 'success' && (
        <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 text-sm">
          {status.message}
        </div>
      )}

      {status.type === 'loading' && (
        <div className="mb-6 bg-blue-50 text-blue-600 p-4 rounded-xl border border-blue-100 text-sm flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {status.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando inventario de etiquetas...</div>
        ) : etiquetas.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No hay etiquetas inactivas</h3>
            <p className="text-slate-500 max-w-sm mt-1">El administrador debe generar un rango numérico de lote antes de poder imprimir.</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {etiquetas.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => toggleSelection(t.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center transition-all-smooth ${
                    selectedIds.includes(t.id) 
                      ? 'border-blue-500 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded border flex items-center justify-center mb-3 transition-colors ${
                    selectedIds.includes(t.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {selectedIds.includes(t.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-800">#{t.id}</span>
                  <span className="text-xs text-slate-400 mt-1 uppercase">{t.estado}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
