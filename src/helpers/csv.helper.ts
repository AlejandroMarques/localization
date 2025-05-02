import * as fs from 'fs';

function parseLine(line: string): string[] {
  const campos = [];
  let campo = '';
  let dentroComillas = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const siguiente = line[i + 1];

    if (char === '"') {
      if (dentroComillas && siguiente === '"') {
        campo += '"';
        i++; // saltar comilla escapada
      } else {
        dentroComillas = !dentroComillas;
      }
    } else if (char === ',' && !dentroComillas) {
      campos.push(campo);
      campo = '';
    } else {
      campo += char;
    }
  }

  campos.push(campo); // último campo
  return campos;
}

export function csvToJson(path: string) {
  const fileData = fs.readFileSync(path, 'utf-8');
  const lineas = fileData
    .trim()
    .split('\n')
    .map((l) => l.trim());
  if (lineas.length < 2) return {};

  const cabecera = parseLine(lineas[0]);
  const filas = lineas.slice(1).map(parseLine);

  const indiceClave = cabecera.indexOf('key');
  if (indiceClave === -1) throw new Error('No se encontró la columna "key"');

  const resultado = {};

  for (const campos of filas) {
    const clave = campos[indiceClave];
    const obj = {};

    cabecera.forEach((columna, idx) => {
      if (idx !== indiceClave) {
        obj[columna] = campos[idx] || '';
      }
    });

    resultado[clave] = obj;
  }

  return resultado;
}

export function jsonToCsv(data: Object) {
  const clavesInternas = new Set();

  for (const key in data) {
    const obj = data[key];
    Object.keys(obj).forEach((k) => clavesInternas.add(k));
  }

  const columnas = ['key', ...Array.from(clavesInternas)];
  const filas = [columnas.join(',')];

  for (const key in data) {
    const fila = [scapeCSV(key)];
    const obj = data[key];
    for (const col of columnas.slice(1)) {
      fila.push(scapeCSV(obj[col] || ''));
    }
    filas.push(fila.join(','));
  }

  return filas.join('\n');
}

function scapeCSV(valor) {
  if (valor == null) return '';
  const str = String(valor);
  if (str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  if (str.includes(',') || str.includes('\n')) {
    return `"${str}"`;
  }
  return str;
}
