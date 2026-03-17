import { NextResponse } from 'next/server';
import { readCSV } from '@/lib/csv';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const decoded: any = verifyToken(token);
    if (!decoded || !['ADMIN', 'SUPERVISOR'].includes(decoded.rol)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const etiquetas = await readCSV<any>('etiquetas.csv');
    
    const stats = {
      total: etiquetas.length,
      activas: etiquetas.filter(e => e.estado === 'activa').length,
      inactivas: etiquetas.filter(e => e.estado === 'inactiva').length
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
