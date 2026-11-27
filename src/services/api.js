const API_URL = import.meta.env.VITE_API_URL;

export async function getFromApi(ruta) {
  const respuesta = await fetch(`${API_URL}${ruta}`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al consultar ${ruta}`);
  }
  return respuesta.json();
}