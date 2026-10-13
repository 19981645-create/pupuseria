import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditarConsulta({ consulta, onUpdate, onCancel }) {

  const fechaFormateada = consulta.fecha ? consulta.fecha.split('T')[0] : '';

  const [formData, setFormData] = useState({
    veterinario_id: consulta.veterinario_id || '',
    mascota_id: consulta.mascota_id || '',
    diagnostico: consulta.diagnostico || '',
    precio: consulta.precio || '',
    fecha: fechaFormateada
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
    axios.put(`https://veterinaria-6svw.onrender.com/consultas/${consulta.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Consulta actualizada correctamente');
        onUpdate();
      })
      .catch(err => console.error('Error al actualizar consulta:', err));
  };

  return (
    <div className="card card-editing">
      <h2>Editar Consulta médica (ID: {consulta.id})</h2>
      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label htmlFor="edit_veterinario_id">Veterinario</label>
          <select id="edit_veterinario_id" name="veterinario_id" value={formData.veterinario_id} onChange={handleChange} required>
            <option value="">Seleccione Veterinario</option>
            {veterinarios.map(v => (
              <option key={v.id} value={v.id}>{v.nombre} - {v.especialidad}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit_mascota_id">Mascota</label>
          <select id="edit_mascota_id" name="mascota_id" value={formData.mascota_id} onChange={handleChange} required>
            <option value="">Seleccione Mascota</option>
            {mascotas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit_precio">Costo de la consulta</label>
          {/* Indicador de moneda: prefijo "$" y sufijo "USD" */}
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
          <small className="form-hint">Ingrese el monto en dólares (ej. 25.00)</small>
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
          <label htmlFor="edit_diagnostico">Diagnóstico</label>
          <input
            id="edit_diagnostico"
            type="text"
            name="diagnostico"
            value={formData.diagnostico}
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

export default EditarConsulta;
