import { NextResponse } from 'next/server';
import { readCSV, writeCSV, appendCSV } from '@/lib/csv';

export async function GET() {
  try {
    const etiquetas = await readCSV<any>('etiquetas.csv');
    const activaciones = await readCSV<any>('activaciones.csv');

    const now = new Date();
    let updatedCount = 0;
    const dateStr = now.toISOString();

    const etiquetasActualizadas = etiquetas.map(etiqueta => {
      if (etiqueta.estado === 'activa') {
        const tagActivations = activaciones.filter(a => a.etiquetaId === etiqueta.id);
        const currentActivacion = tagActivations[tagActivations.length - 1]; 

        if (currentActivacion) {
          const expirationDate = new Date(currentActivacion.fechaFin);
          // Si ya pasamos la fecha final
          if (now > expirationDate) {
            etiqueta.estado = 'inactiva';
            updatedCount++;
          }
        }
      }
      return etiqueta;
    });

    if (updatedCount > 0) {
      await writeCSV('etiquetas.csv', etiquetasActualizadas, [
        { id: 'id', title: 'id' },
        { id: 'estado', title: 'estado' },
        { id: 'fechaCreacion', title: 'fechaCreacion' }
      ]);
      
      await appendCSV('auditoria.csv', [{
        id: Date.now().toString(),
        usuarioId: 'SISTEMA',
        accion: 'LIMPIEZA_AUTOMATICA',
        detalle: `Se desactivaron ${updatedCount} etiquetas expiradas.`,
        fecha: dateStr
      }], [
        { id: 'id', title: 'id' },
        { id: 'usuarioId', title: 'usuarioId' },
        { id: 'accion', title: 'accion' },
        { id: 'detalle', title: 'detalle' },
        { id: 'fecha', title: 'fecha' }
      ]);
    }

    return NextResponse.json({ success: true, count: updatedCount });
  } catch (error) {
    console.error('Error en limpieza:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
