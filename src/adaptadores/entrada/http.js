/**
 * ADAPTADOR DE ENTRADA · la API HTTP (Etapa 3)
 * Traduce HTTP al idioma del negocio (los casos de uso) y viceversa. Las rutas traducen, no deciden.
 */
import { createServer } from 'node:http';
import { CODIGOS, ErrorDeDominio } from '../../dominio/evaluacion.js';
import { ErrorHttp, crearManejador } from './nucleo-http.mjs';

// De código del dominio a estado HTTP.
const ESTADO_POR_CODIGO = {
  [CODIGOS.NO_EXISTE]: 404, // el recurso no existe
  [CODIGOS.NOMBRE_INVALIDO]: 422, // el contenido enviado incumple una regla
  [CODIGOS.PESO_INVALIDO]: 422,
  [CODIGOS.NOTA_INVALIDA]: 422,
  [CODIGOS.NOMBRE_REPETIDO]: 409, // choca con el estado actual
  [CODIGOS.PESO_EXCEDIDO]: 409,
};

/** El núcleo la llama con cada error que no es un ErrorHttp. */
export function traducirError(error) {
  if (!(error instanceof ErrorDeDominio)) return error; // el núcleo lo vuelve 500 sin filtrar detalles
  return new ErrorHttp(ESTADO_POR_CODIGO[error.codigo] ?? 422, error.message);
}

/** Las rutas de la API: cada una es { metodo, ruta, manejador }. */
export function crearRutas(casos) {
  return [
    { metodo: 'GET', ruta: '/evaluaciones', manejador: () => ({ status: 200, cuerpo: casos.listar() }) },
    {
      metodo: 'GET',
      ruta: '/evaluaciones/{id}',
      manejador: ({ params }) => ({ status: 200, cuerpo: casos.ver(Number(params.id)) }),
    },
    {
      metodo: 'POST',
      ruta: '/evaluaciones',
      manejador: ({ cuerpo }) => {
        const creada = casos.crear(cuerpo);
        return { status: 201, cuerpo: creada, cabeceras: { Location: '/evaluaciones/' + creada.id } };
      },
    },
    {
      metodo: 'PATCH',
      ruta: '/evaluaciones/{id}',
      manejador: ({ params, cuerpo }) => ({ status: 200, cuerpo: casos.calificar(Number(params.id), cuerpo.nota) }),
    },
    {
      metodo: 'DELETE',
      ruta: '/evaluaciones/{id}',
      manejador: ({ params }) => {
        casos.eliminar(Number(params.id));
        return { status: 204 };
      },
    },
    { metodo: 'GET', ruta: '/resumen', manejador: () => ({ status: 200, cuerpo: casos.resumen() }) },
  ];
}

/** Arma el servidor HTTP (ya venía escrito). */
export function crearApi(casos) {
  const rutas = [...crearRutas(casos), { metodo: 'GET', ruta: '/salud', manejador: () => ({ status: 200, cuerpo: { estado: 'ok' } }) }];
  return createServer(crearManejador({ rutas, traducirError }));
}