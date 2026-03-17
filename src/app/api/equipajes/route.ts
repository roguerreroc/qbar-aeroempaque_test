import { NextResponse } from 'next/server';
import { readCSV } from '@/lib/csv';

export async function GET() {
  try {
    const tipos = await readCSV('tipos_equipaje.csv');
    return NextResponse.json({ success: true, tipos });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
