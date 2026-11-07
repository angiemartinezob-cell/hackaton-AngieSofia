/**
 * ADAPTADOR DE SALIDA · repositorio en memoria                             (ETAPA 2 · tu trabajo)
 *
 * Cumple el puerto de ../../aplicacion/puerto-repositorio.js guardando las evaluaciones en un arreglo.
 * Es el adaptador más simple: sirve para las pruebas y para arrancar sin configurar nada.
 *
 * Lo importante es el CONTRATO (lee el puerto): ids que asigna él mismo (mayor + 1), copias en vez de las referencias
 * originales y los cuatro métodos con el significado exacto. Las pruebas de la Etapa 2 son las MISMAS para el
 * adaptador de archivo: si los dos las pasan, son intercambiables y el resto de la aplicación no se entera.
 *
 * Comprueba con:   npm run verificar -- 2
 */

export function crearRepositorioMemoria() {
  let lista = [];
  const siguienteId = () => lista.reduce((mayor, e) => Math.max(mayor, e.id), 0) + 1;

  return {
    listar() {
      return lista.map((e) => ({ ...e }));
    },
    obtener(id) {
      const e = lista.find((x) => x.id === id);
      return e ? { ...e } : undefined;
    },
    guardar(evaluacion) {
      if (evaluacion.id !== undefined && lista.some((e) => e.id === evaluacion.id)) {
        lista = lista.map((e) => (e.id === evaluacion.id ? { ...evaluacion } : e));
        return { ...evaluacion };
      }
      const nueva = { ...evaluacion, id: siguienteId() };
      lista.push(nueva);
      return { ...nueva };
    },
    eliminar(id) {
      const antes = lista.length;
      lista = lista.filter((e) => e.id !== id);
      return lista.length < antes;
    },
  };
}
