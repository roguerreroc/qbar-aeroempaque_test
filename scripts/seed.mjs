import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');

async function seed() {
  console.log('🌱 Inicializando seed de base de datos...');
  
  // 1. Seed Usuarios (Admin)
  const usersPath = path.join(DATA_DIR, 'usuarios.csv');
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('admin123', salt);
  
  // Escribimos directamente el admin sobrescribiendo lo que haya (para empezar limpios)
  const userHeader = 'id,nombre,email,password,rol\n';
  const adminRow = `1,Administrador,admin@aeroempaque.com,${hash},ADMIN\n`;
  fs.writeFileSync(usersPath, userHeader + adminRow);
  console.log('✅ usuarios.csv inicializado con cuenta Admin (admin@aeroempaque.com / admin123).');

  // 2. Seed Tipos Equipaje
  const tiposPath = path.join(DATA_DIR, 'tipos_equipaje.csv');
  const tiposHeader = 'id,nombre,precio\n';
  const tiposRows = [
    '1,Básico (Cabina - Max 8kg),0',
    '2,Bodega Ligero (Max 15kg),30',
    '3,Bodega Estándar (Max 23kg),50',
    '4,Sobredimensionado Especial,100'
  ].join('\n') + '\n';
  fs.writeFileSync(tiposPath, tiposHeader + tiposRows);
  console.log('✅ tipos_equipaje.csv inicializado con tipos por defecto.');
  
  console.log('🎉 Seed finalizado correctamente.');
}

seed();
