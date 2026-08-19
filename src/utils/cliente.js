function generarUUIDFallback() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function obtenerClienteId() {
  let id = localStorage.getItem("cliente_id");

  if (!id) {
    if (typeof window !== "undefined" && window.crypto && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = generarUUIDFallback();
    }

    localStorage.setItem("cliente_id", id);
  }

  return id;
}