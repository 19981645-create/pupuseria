import React, { useState } from 'react';
import axios from 'axios';
import EditarConsulta from './EditarConsulta';

function ListaConsultas({ consultas = [], onUpdate }) {
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);

  const manejarActualizacion = () => {
    setConsultaSeleccionada(null);
    onUpdate();
  };

  const eliminarConsulta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta consulta médica?')) {
      axios.delete(`https://veterinaria-6svw.onrender.com/consultas/${id}`)
        .then(res => {
          alert(res.data.message || 'Consulta eliminada con éxito');
          onUpdate();
        })
        .catch(err => console.error('Error al eliminar consulta:', err));
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
      {consultaSeleccionada && (
        <EditarConsulta
          consulta={consultaSeleccionada}
          onUpdate={manejarActualizacion}
          onCancel={() => setConsultaSeleccionada(null)}
        />
      )}

      <div className="card">
        <h2>Historial de Consultas Médicas</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Veterinario</th>
                <th>Mascota</th>
                <th>Especie</th>
                <th>Diagnóstico</th>
                <th>Precio (USD)</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!consultas || consultas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No hay consultas registradas.
                  </td>
                </tr>
              ) : (
                consultas.map(c => {
                  const nombreVet = c.veterinario || c.nombre_veterinario || (c.veterinario_id ? `Vet ID: ${c.veterinario_id}` : '-');
                  const nombreMascota = c.mascota || c.nombre_mascota || (c.mascota_id ? `Mascota ID: ${c.mascota_id}` : '-');
                  const especieMascota = c.especie || c.especie_mascota || '-';
                  const diagnosticoMed = c.diagnostico || '-';

                  return (
                    <tr key={c.id}>
                      <td data-label="Veterinario"><strong>{nombreVet}</strong></td>
                      <td data-label="Mascota">{nombreMascota}</td>
                      <td data-label="Especie">
                        {especieMascota !== '-'
                          ? <span className="species-badge">{especieMascota}</span>
                          : '-'}
                      </td>
                      <td data-label="Diagnóstico">{diagnosticoMed}</td>
                      <td data-label="Precio" className="price-tag">${formatearPrecio(c.precio)}</td>
                      <td data-label="Fecha">{formatearFecha(c.fecha)}</td>
                      <td data-label="Acciones">
                        <div className="acciones">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => setConsultaSeleccionada(c)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => eliminarConsulta(c.id)}
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

export default ListaConsultas;
