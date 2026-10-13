import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioConsulta({ onConsultaAgregada }) {
  const [formData, setFormData] = useState({
    veterinario_id: '',
    mascota_id: '',
    diagnostico: '',
    precio: '',
    fecha: ''
  });

  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    axios.get('https://veterinaria-6svw.onrender.com/veterinarios')
      .then(res => setVeterinarios(res.data))
      .catch(err => console.error(err));

    axios.get('https://veterinaria-6svw.onrender.com/mascotas')
      .then(res => setMascotas(res.data))
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
    axios.post('https://veterinaria-6svw.onrender.com/consultas', formData)
      .then(res => {
        alert(res.data.message);
        setFormData({ veterinario_id: '', mascota_id: '', diagnostico: '', precio: '', fecha: '' });
        if (onConsultaAgregada) onConsultaAgregada(); // Actualiza la lista si se pasa la prop
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="card card-form">
      <h2>Registrar Nueva Consulta Médica</h2>
      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label htmlFor="veterinario_id">Veterinario</label>
          <select id="veterinario_id" name="veterinario_id" value={formData.veterinario_id} onChange={handleChange} required>
            <option value="">Seleccione Veterinario</option>
            {veterinarios.map(v => (
              <option key={v.id} value={v.id}>{v.nombre} - {v.especialidad}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mascota_id">Mascota</label>
          <select id="mascota_id" name="mascota_id" value={formData.mascota_id} onChange={handleChange} required>
            <option value="">Seleccione Mascota</option>
            {mascotas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Costo de la consulta</label>
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
          <small className="form-hint">Ingrese el monto en dólares (ej. 25.00)</small>
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
          <label htmlFor="diagnostico">Diagnóstico</label>
          <input
            id="diagnostico"
            type="text"
            name="diagnostico"
            placeholder="Diagnóstico médico"
            value={formData.diagnostico}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <button type="submit" className="btn-submit">Registrar Consulta</button>
        </div>

      </form>
    </div>
  );
}

export default FormularioConsulta;
