import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioOrden({ onOrdenAgregada }) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    pupusa_id: '',
    detalle_pedido: '',
    precio: '',
    fecha: ''
  });

  const [clientes, setClientes] = useState([]);
  const [pupusas, setPupusas] = useState([]);

  useEffect(() => {
    axios.get('https://pupuseria-nbm3.onrender.com/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));

    axios.get('https://pupuseria-nbm3.onrender.com/pupusas')
      .then(res => setPupusas(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://pupuseria-nbm3.onrender.com/ordenes', formData)
      .then(res => {
        alert(res.data.message);
        setFormData({ cliente_id: '', pupusa_id: '', detalle_pedido: '', precio: '', fecha: '' });
        if (onOrdenAgregada) onOrdenAgregada(); // Actualiza la lista si se pasa la prop
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="card card-form">
      <h2>Registrar Nueva Orden</h2>
      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label htmlFor="cliente_id">Cliente</label>
          <select id="cliente_id" name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
            <option value="">Seleccione Cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pupusa_id">Pupusa</label>
          <select id="pupusa_id" name="pupusa_id" value={formData.pupusa_id} onChange={handleChange} required>
            <option value="">Seleccione Pupusa</option>
            {pupusas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.especialidad})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio total de la orden</label>
          {/* Indicador de moneda: prefijo "$" y sufijo "USD" */}
          <div className="input-group">
            <span className="input-addon" aria-hidden="true">$</span>
            <input
              id="precio"
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
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="detalle_pedido">Detalle del Pedido</label>
          <input
            id="detalle_pedido"
            type="text"
            name="detalle_pedido"
            placeholder="Especificaciones (ej. 3 de revueltas con curtido extra)"
            value={formData.detalle_pedido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <button type="submit" className="btn-submit">Registrar Orden</button>
        </div>

      </form>
    </div>
  );
}

export default FormularioOrden;