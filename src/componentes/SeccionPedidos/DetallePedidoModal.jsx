import "./DetallePedidoModal.css"

export const DetallePedidoModal = ({ pedido, onClose }) => {
  if (!pedido) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalle del Pedido #{String(pedido?.id || '').slice(0, 8)}</h3>
          <button className="btn-cerrar" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="items-lista">
            <h4>Productos</h4>
            {pedido?.items && pedido.items.length > 0 ? (
              pedido.items.map((item, idx) => (
                <div key={idx} className="detalle-item">
                  <span className="item-cant-nombre">
                    <strong>{item.cantidad || 1}x</strong> {item.nombre || item.titulo || "Producto"}
                  </span>
                  <span className="item-precio">
                    ${((item.precio || 0) * (item.cantidad || 1)).toLocaleString('es-AR')}
                  </span>
                </div>
              ))
            ) : (
              <p className="sin-items">Sin desglose de productos disponible.</p>
            )}
          </div>

          {pedido?.direccion && (
            <div className="modal-info-extra">
              <strong>📍 Entrega en:</strong>
              <p>{pedido.direccion}</p>
            </div>
          )}

          {pedido?.metodo_pago && (
            <div className="modal-info-extra">
              <strong>💳 Medio de pago:</strong>
              <p>{pedido.metodo_pago}</p>
            </div>
          )}

          <div className="modal-resumen-total">
            <span>Total pagado:</span>
            <strong>${pedido?.total?.toLocaleString('es-AR') || '0'}</strong>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cerrar-modal" onClick={onClose} type="button">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};