import React, { useState } from 'react';
import axios from 'axios';
import EditarOrden from './EditarOrden';

function ListaOrdenes({ ordenes = [], onUpdate }) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const manejarActualizacion = () => {
    setOrdenSeleccionada(null);
    onUpdate();
  };

  const eliminarOrden = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta orden?')) {
      axios.delete(`https://pupuseria-nbm3.onrender.com//ordenes/${id}`)
        .then(res => {
          alert(res.data.message || 'Orden eliminada con éxito');
          onUpdate();
        })
        .catch(err => console.error('Error al eliminar orden:', err));
    }
  };

  const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) return '0.00';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const strFecha = String(fecha);
    return strFecha.includes('T') ? strFecha.split('T')[0] : strFecha;
  };

  return (
    <div>
      {ordenSeleccionada && (
        <EditarOrden
          orden={ordenSeleccionada}
          onUpdate={manejarActualizacion}
          onCancel={() => setOrdenSeleccionada(null)}
        />
      )}

      <div className="card">
        <h2>Historial de Órdenes</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Pupusa</th>
                <th>Especialidad</th>
                <th>Detalle del Pedido</th>
                <th>Precio (USD)</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!ordenes || ordenes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No hay órdenes registradas.
                  </td>
                </tr>
              ) : (
                ordenes.map(o => {
                  const nombreCliente = o.cliente || o.nombre_cliente || (o.cliente_id ? `Cliente ID: ${o.cliente_id}` : '-');
                  const nombrePupusa = o.pupusa || o.nombre_pupusa || (o.pupusa_id ? `Pupusa ID: ${o.pupusa_id}` : '-');
                  const especialidadPupusa = o.especialidad || o.especialidad_pupusa || '-';
                  const detallePed = o.detalle_pedido || '-';

                  return (
                    <tr key={o.id}>
                      <td data-label="Cliente"><strong>{nombreCliente}</strong></td>
                      <td data-label="Pupusa">{nombrePupusa}</td>
                      <td data-label="Especialidad">
                        {especialidadPupusa !== '-'
                          ? <span className="species-badge">{especialidadPupusa}</span>
                          : '-'}
                      </td>
                      <td data-label="Detalle del Pedido">{detallePed}</td>
                      <td data-label="Precio" className="price-tag">${formatearPrecio(o.precio)}</td>
                      <td data-label="Fecha">{formatearFecha(o.fecha)}</td>
                      <td data-label="Acciones">
                        <div className="acciones">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => setOrdenSeleccionada(o)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => eliminarOrden(o.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListaOrdenes;