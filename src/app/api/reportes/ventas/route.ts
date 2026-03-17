import { NextResponse } from 'next/server';
import { readCSV } from '@/lib/csv';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const decoded: any = verifyToken(token);
    if (!decoded || !['ADMIN', 'SUPERVISOR'].includes(decoded.rol)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startObj = searchParams.get('start');
    const endObj = searchParams.get('end');

    const activaciones = await readCSV<any>('activaciones.csv');
    
    let filtered = activaciones;
    
    if (startObj && endObj) {
      const startDate = new Date(startObj);
      const endDate = new Date(endObj);
      endDate.setHours(23, 59, 59, 999);

      filtered = activaciones.filter(a => {
        const d = new Date(a.fechaRegistro);
        return d >= startDate && d <= endDate;
      });
    }

    const totalVentas = filtered.reduce((sum, a) => sum + Number(a.precioCobrado || 0), 0);
    
    return NextResponse.json({ 
      success: true, 
      total: totalVentas, 
      count: filtered.length, 
      data: filtered 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
