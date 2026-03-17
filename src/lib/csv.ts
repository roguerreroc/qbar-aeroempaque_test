import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

// Rutas base para los archivos CSV
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Lee todos los registros de un archivo CSV y los retorna como un arreglo de objetos tipados.
 */
export async function readCSV<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, filename);
  const results: T[] = [];

  if (!fs.existsSync(filePath)) {
    return results;
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data as T))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

/**
 * Sobrescribe completamente un archivo CSV con los datos proporcionados.
 * Esto es útil para actualizaciones o borrados (leyendo todo, modificando en memoria y guardando).
 */
export async function writeCSV<T>(filename: string, data: T[], headers: { id: string; title: string }[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers,
  });

  await csvWriter.writeRecords(data as any);
}

/**
 * Agrega datos al final de un archivo CSV existente, creando el archivo con headers si no existe.
 */
export async function appendCSV<T>(filename: string, data: T[], headers: { id: string; title: string }[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  const fileExists = fs.existsSync(filePath);

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers,
    append: fileExists,
  });

  await csvWriter.writeRecords(data as any);
}

/**
 * Función genérica de utilidad para actualizar un registro por su ID.
 * Lee todos, actualiza el objeto si coincide el ID, y escribe de nuevo.
 */
export async function updateRecordInCSV<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>,
  headers: { id: string; title: string }[]
): Promise<boolean> {
  const records = await readCSV<T>(filename);
  const recordIndex = records.findIndex((r) => r.id === id);

  if (recordIndex === -1) {
    return false;
  }

  // Mezclamos el registro existente con los updates
  records[recordIndex] = { ...records[recordIndex], ...updates };
  
  // Guardamos todo el arreglo actualizado sobreescribiendo el CSV
  await writeCSV(filename, records, headers);
  return true;
}
