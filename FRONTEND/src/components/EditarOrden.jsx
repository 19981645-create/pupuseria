import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define la URL base de tu backend activo en Render
const API_URL = 'https://pupuseria-1.onrender.com';

function EditarOrden({ orden, onUpdate, onCancel }) {

  const fechaFormateada = orden && orden.fecha ? orden.fecha.split('T')[0] : '';

  const [formData, setFormData] = useState({
    cliente_id: orden?.cliente_id || '',
    pupusa_id: orden?.pupusa_id || '',
    detalle_pedido: orden?.detalle_pedido || '',
    precio: orden?.precio || '',
    fecha: fechaFormateada
  });

  const [clientes, setClientes] = useState([]);
  const [pupusas, setPupusas] = useState([]);

  // Actualiza los campos si cambia la orden seleccionada
  useEffect(() => {
    if (orden) {
      setFormData({
        cliente_id: orden.cliente_id || '',
        pupusa_id: orden.pupusa_id || '',
        detalle_pedido: orden.detalle_pedido || '',
        precio: orden.precio || '',
        fecha: orden.fecha ? orden.fecha.split('T')[0] : ''
      });
    }
  }, [orden]);

  // Cargar clientes y pupusas al montar el componente
  useEffect(() => {
    axios.get(`${API_URL}/clientes`)
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));

    axios.get(`${API_URL}/pupusas`)
      .then(res => setPupusas(res.data))
      .catch(err => console.error('Error al cargar pupusas:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}/ordenes/${orden.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Orden actualizada correctamente');
        onUpdate();
      })
      .catch(err => console.error('Error al actualizar orden:', err));
  };

  if (!orden) return null; // Si no hay orden seleccionada, no renderiza nada

  return (
    <div className="card card-editing">
      <h2>Editar Orden (ID: {orden.id})</h2>
      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label htmlFor="edit_cliente_id">Cliente</label>
          <select id="edit_cliente_id" name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
            <option value="">Seleccione Cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit_pupusa_id">Pupusa</label>
          <select id="edit_pupusa_id" name="pupusa_id" value={formData.pupusa_id} onChange={handleChange} required>
            <option value="">Seleccione Pupusa</option>
            {pupusas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.especialidad})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit_precio">Precio total de la orden</label>
          <div className="input-group">
            <span className="input-addon" aria-hidden="true">$</span>
            <input
              id="edit_precio"
              type="number"
              step="0.01"
              min="0"
              name="precio"
              placeholder="0.00"
              value={formData.precio}
              onChange={handleChange}
              required
            />
            <span className="input-addon suffix" aria-hidden="true">USD</span>
          </div>
          <small className="form-hint">Ingrese el monto en dólares (ej. 5.00)</small>
        </div>

        <div className="form-group">
          <label htmlFor="edit_fecha">Fecha</label>
          <input
            id="edit_fecha"
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="edit_detalle_pedido">Detalle del Pedido</label>
          <input
            id="edit_detalle_pedido"
            type="text"
            name="detalle_pedido"
            placeholder="Especificaciones del pedido"
            value={formData.detalle_pedido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width form-actions">
          <button type="submit" className="btn-submit btn-edit">Guardar Cambios</button>
          <button type="button" onClick={onCancel} className="btn-submit btn-cancel">Cancelar</button>
        </div>

      </form>
    </div>
  );
}

export default EditarOrden;
