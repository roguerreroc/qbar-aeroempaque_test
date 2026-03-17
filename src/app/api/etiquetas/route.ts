import { NextResponse } from 'next/server';
import { readCSV } from '@/lib/csv';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const etiquetas = await readCSV<any>('etiquetas.csv');
    // Para no saturar en el MVP en caso de miles, retornamos las más recientes o todas
    return NextResponse.json({ success: true, etiquetas });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
