/**
 * ADAPTADOR DE SALIDA · repositorio en un archivo JSON                     (ETAPA 2 · tu trabajo)
 *
 * Cumple EL MISMO puerto que el de memoria, pero guarda las evaluaciones en un archivo: un arreglo JSON.
 * Así los datos sobreviven a un reinicio del servidor (y, en la Etapa 6, a un contenedor nuevo).
 *
 *   crearRepositorioArchivo('/ruta/evaluaciones.json')
 *
 * Detalles que las pruebas comprueban:
 *   · si el archivo todavía no existe, `listar()` devuelve [] (no es un error);
 *   · al guardar por primera vez se crea el archivo… y también su carpeta, si hace falta (mira mkdirSync con { recursive: true });
 *   · otra instancia apuntando al mismo archivo ve lo que guardó la primera;
 *   · las mismas reglas del contrato que el de memoria (ids, copias, orden).
 *
 * Usa node:fs en su versión síncrona (readFileSync, writeFileSync, existsSync, mkdirSync) y node:path.
 *
 * Comprueba con:   npm run verificar -- 2
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function crearRepositorioArchivo(ruta) {
  const leer = () => (existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : []);
  const escribir = (lista) => {
    mkdirSync(dirname(ruta), { recursive: true });
    writeFileSync(ruta, JSON.stringify(lista, null, 2));
  };

  return {
    listar() {
      return leer(); // se lee del disco cada vez: ya son copias nuevas
    },
    obtener(id) {
      return leer().find((e) => e.id === id);
    },
    guardar(evaluacion) {
      const lista = leer();
      const i = evaluacion.id === undefined ? -1 : lista.findIndex((e) => e.id === evaluacion.id);
      const guardada =
        i >= 0 ? { ...evaluacion } : { ...evaluacion, id: lista.reduce((mayor, e) => Math.max(mayor, e.id), 0) + 1 };
      if (i >= 0) lista[i] = guardada;
      else lista.push(guardada);
      escribir(lista);
      return { ...guardada };
    },
    eliminar(id) {
      const lista = leer();
      const quedan = lista.filter((e) => e.id !== id);
      if (quedan.length === lista.length) return false;
      escribir(quedan);
      return true;
    },
  };
}