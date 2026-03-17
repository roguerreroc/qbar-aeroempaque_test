import { NextResponse } from 'next/server';
import { readCSV, appendCSV } from '@/lib/csv';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const decoded: any = verifyToken(token);
    if (!decoded || decoded.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const { startId, endId } = await req.json();

    if (!startId || !endId || startId > endId) {
      return NextResponse.json({ error: 'Rango numérico inválido' }, { status: 400 });
    }

    const start = Number(startId);
    const end = Number(endId);

    // Validar solapamiento
    const existingTags = await readCSV<any>('etiquetas.csv');
    const hasOverlap = existingTags.some(tag => {
      const tagId = Number(tag.id);
      return tagId >= start && tagId <= end;
    });

    if (hasOverlap) {
      return NextResponse.json({ error: 'El rango especificado se solapa con etiquetas existentes' }, { status: 400 });
    }

    // Generar nuevas etiquetas
    const newTags = [];
    const date = new Date().toISOString();
    
    for (let i = start; i <= end; i++) {
        // En Next.js el entorno debe ser lo más rápido posible, por lo que empujamos al array en memoria
      newTags.push({
        id: String(i),
        estado: 'inactiva',
        fechaCreacion: date
      });
    }

    // Guardar en CSV de etiquetas
    await appendCSV('etiquetas.csv', newTags, [
      { id: 'id', title: 'id' },
      { id: 'estado', title: 'estado' },
      { id: 'fechaCreacion', title: 'fechaCreacion' }
    ]);

    // Registrar en auditoría
    const auditData = [{
      id: Date.now().toString(),
      usuarioId: decoded.id,
      accion: 'GENERACION_ETIQUETAS',
      detalle: `Rango generado: ${start} al ${end} (${newTags.length} etiquetas)`,
      fecha: date
    }];

    await appendCSV('auditoria.csv', auditData, [
      { id: 'id', title: 'id' },
      { id: 'usuarioId', title: 'usuarioId' },
      { id: 'accion', title: 'accion' },
      { id: 'detalle', title: 'detalle' },
      { id: 'fecha', title: 'fecha' }
    ]);

    return NextResponse.json({ success: true, count: newTags.length });
  } catch (error) {
    console.error('Error generando etiquetas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
