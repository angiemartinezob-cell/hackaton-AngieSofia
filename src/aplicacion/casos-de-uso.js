/**
 * CASOS DE USO · lo que el negocio ofrece                                  (ETAPA 1 · 15 puntos · tu trabajo)
 *
 * Un caso de uso ORQUESTA: le pide datos al puerto de salida (el repositorio), le pide al dominio que decida y
 * guarda el resultado. No sabe si el repositorio es memoria, un archivo o una base de datos, ni si quien lo llama
 * es una API HTTP, una línea de comandos o una prueba.
 *
 * Recibes el repositorio YA CONSTRUIDO (se lo pasa quien compone la aplicación): { repositorio }.
 * Sus cuatro métodos están en puerto-repositorio.js. Las reglas del negocio están en ../dominio/evaluacion.js:
 * ÚSALAS; si te descubres escribiendo `if (peso > 100)` aquí, detente.
 *
 * Reglas de esta etapa (la prueba las comprueba con un repositorio falso):
 *   · hablas con el repositorio solo por sus cuatro métodos;
 *   · cuando algo no existe, lanzas new ErrorDeDominio(CODIGOS.NO_EXISTE, '…');
 *   · este archivo no importa nada de afuera: solo el dominio.
 *
 * Comprueba con:   npm run verificar -- 1
 */
import { CODIGOS, ErrorDeDominio } from '../dominio/evaluacion.js';
import * as Evaluacion from '../dominio/evaluacion.js';

export function crearCasosDeUso({ repositorio }) {
  // «Buscar o fallar»: la usan ver, calificar y eliminar.
  function buscar(id) {
    const encontrada = repositorio.obtener(id);
    if (!encontrada) throw new ErrorDeDominio(CODIGOS.NO_EXISTE, `No existe la evaluación ${id}.`);
    return encontrada;
  }

  return {
    listar() {
      return repositorio.listar();
    },
    ver(id) {
      return buscar(id);
    },
    crear(datos) {
      const nueva = Evaluacion.crear(datos, repositorio.listar()); // el dominio valida con lo ya guardado
      return repositorio.guardar(nueva); // el repositorio le pone el id
    },
    calificar(id, nota) {
      const calificada = Evaluacion.calificar(buscar(id), nota);
      return repositorio.guardar(calificada);
    },
    eliminar(id) {
      buscar(id); // para que falle con NO_EXISTE si no está
      repositorio.eliminar(id);
    },
    resumen() {
      return Evaluacion.resumen(repositorio.listar());
    },
  };
}