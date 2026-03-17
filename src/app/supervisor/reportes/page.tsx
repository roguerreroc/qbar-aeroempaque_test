'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ReportesPage() {
  const [ventas, setVentas] = useState<any>({ total: 0, count: 0, data: [] });
  const [inventario, setInventario] = useState<any>({ total: 0, activas: 0, inactivas: 0 });
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDatos = async () => {
    setLoading(true);
    let url = '/api/reportes/ventas';
    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
    }

    try {
      const resVentas = await fetch(url);
      const dataVentas = await resVentas.json();
      if (dataVentas.success) setVentas(dataVentas);

      const resInv = await fetch('/api/reportes/inventario');
      const dataInv = await resInv.json();
      if (dataInv.success) setInventario(dataInv.stats);

    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDatos();
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ventas.data.map((v: any) => ({
      ID_Venta: v.id,
      Etiqueta: v.etiquetaId,
      Reserva: v.reserva,
      Ruta: `${v.vueloOrigen}-${v.vueloDestino}`,
      Fecha_Activacion: new Date(v.fechaRegistro).toLocaleDateString(),
      Precio: v.precioCobrado
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, `Reporte_Aeroempaque_${Date.now()}.xlsx`);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Ventas - AeroEmpaque", 14, 22);
    doc.setFontSize(12);
    doc.text(`Total Generado: $${ventas.total}`, 14, 30);
    doc.text(`Etiquetas Vendidas: ${ventas.count}`, 14, 38);

    const tableData = ventas.data.map((v: any) => [
      v.etiquetaId,
      v.vueloOrigen + ' - ' + v.vueloDestino,
      v.reserva,
      new Date(v.fechaRegistro).toLocaleDateString(),
      `$${v.precioCobrado}`
    ]);

    (doc as any).autoTable({
      startY: 45,
      head: [['ID Etiqueta', 'Ruta', 'Reserva', 'Fecha', 'Precio']],
      body: tableData,
    });

    doc.save(`Reporte_Aeroempaque_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="mb-6 border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reportes Consolidados</h1>
          <p className="text-slate-500 mt-1">Monitoree las ventas, activaciones y el inventario disponible.</p>
        </div>
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center transition-all-smooth hover-lift">
          <p className="text-slate-500 text-sm font-semibold uppercase mb-2">Ingresos Totales</p>
          <p className="text-4xl font-extrabold text-blue-600">${ventas.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center transition-all-smooth hover-lift">
          <p className="text-slate-500 text-sm font-semibold uppercase mb-2">Activaciones</p>
          <p className="text-4xl font-extrabold text-indigo-600">{ventas.count}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center transition-all-smooth hover-lift">
          <p className="text-slate-500 text-sm font-semibold uppercase mb-2">Etiquetas Inactivas</p>
          <p className="text-4xl font-extrabold text-slate-700">{inventario.inactivas}</p>
          <p className="text-xs text-slate-400 mt-1">Stock para uso</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center transition-all-smooth hover-lift">
          <p className="text-slate-500 text-sm font-semibold uppercase mb-2">Etiquetas Activas</p>
          <p className="text-4xl font-extrabold text-emerald-600">{inventario.activas}</p>
          <p className="text-xs text-slate-400 mt-1">Pasajeros volando</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 mb-8">
        <form onSubmit={handleFiltrar} className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Desde</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Hasta</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="px-6 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors">
            Filtrar Rango
          </button>
          
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={exportarExcel} disabled={ventas.data.length === 0} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
               XLSX
            </button>
            <button type="button" onClick={exportarPDF} disabled={ventas.data.length === 0} className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
               PDF
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-slate-500">Cargando datos...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Reserva</th>
                <th className="px-6 py-4 font-semibold">Ruta</th>
                <th className="px-6 py-4 font-semibold">Fecha Activación</th>
                <th className="px-6 py-4 font-semibold">Recaudo</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {ventas.data.map((v: any, i: number) => (
                <tr key={v.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{v.etiquetaId}</td>
                  <td className="px-6 py-4">{v.reserva}</td>
                  <td className="px-6 py-4">{v.vueloOrigen} &rarr; {v.vueloDestino}</td>
                  <td className="px-6 py-4">{new Date(v.fechaRegistro).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${v.precioCobrado}</td>
                </tr>
              ))}
              {ventas.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron registros en el rango seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
