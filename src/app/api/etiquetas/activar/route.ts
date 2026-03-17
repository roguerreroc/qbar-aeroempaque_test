import { NextResponse } from 'next/server';
import { readCSV, appendCSV, updateRecordInCSV } from '@/lib/csv';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const decoded: any = verifyToken(token);
    if (!decoded || !['ADMIN', 'OPERADOR'].includes(decoded.rol)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const { etiquetaId, reserva, vueloOrigen, vueloDestino, tipoEquipajeId, fechaInicio, fechaFin, precioCobrado } = await req.json();

    if (!etiquetaId || !reserva || !vueloOrigen || !vueloDestino || !tipoEquipajeId || !fechaInicio || !fechaFin) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const etiquetas = await readCSV<any>('etiquetas.csv');
    const etiqueta = etiquetas.find(e => e.id === String(etiquetaId));

    if (!etiqueta) {
      return NextResponse.json({ error: 'La etiqueta especificada no existe en el inventario' }, { status: 404 });
    }

    if (etiqueta.estado === 'activa') {
      return NextResponse.json({ error: 'La etiqueta ya se encuentra activa para otro viaje' }, { status: 400 });
    }

    // Actualizar estado de etiqueta
    await updateRecordInCSV<any>('etiquetas.csv', String(etiquetaId), { estado: 'activa' }, [
      { id: 'id', title: 'id' },
      { id: 'estado', title: 'estado' },
      { id: 'fechaCreacion', title: 'fechaCreacion' }
    ]);

    const date = new Date().toISOString();
    
    // Registrar la activación
    await appendCSV('activaciones.csv', [{
      id: Date.now().toString(),
      etiquetaId: String(etiquetaId),
      reserva,
      vueloOrigen,
      vueloDestino,
      tipoEquipajeId,
      fechaInicio,
      fechaFin,
      operadorId: decoded.id,
      precioCobrado: precioCobrado || 0,
      fechaRegistro: date
    }], [
      { id: 'id', title: 'id' },
      { id: 'etiquetaId', title: 'etiquetaId' },
      { id: 'reserva', title: 'reserva' },
      { id: 'vueloOrigen', title: 'vueloOrigen' },
      { id: 'vueloDestino', title: 'vueloDestino' },
      { id: 'tipoEquipajeId', title: 'tipoEquipajeId' },
      { id: 'fechaInicio', title: 'fechaInicio' },
      { id: 'fechaFin', title: 'fechaFin' },
      { id: 'operadorId', title: 'operadorId' },
      { id: 'precioCobrado', title: 'precioCobrado' },
      { id: 'fechaRegistro', title: 'fechaRegistro' }
    ]);

    // Auditoria
    await appendCSV('auditoria.csv', [{
      id: Date.now().toString() + '1',
      usuarioId: decoded.id,
      accion: 'ACTIVACION_ETIQUETA',
      detalle: `Etiqueta ${etiquetaId} activada para reserva ${reserva}`,
      fecha: date
    }], [
      { id: 'id', title: 'id' },
      { id: 'usuarioId', title: 'usuarioId' },
      { id: 'accion', title: 'accion' },
      { id: 'detalle', title: 'detalle' },
      { id: 'fecha', title: 'fecha' }
    ]);

    return NextResponse.json({ success: true, message: 'Etiqueta activada correctamente' });

  } catch (error) {
    console.error('Error en activación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
