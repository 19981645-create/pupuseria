import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioOrden from './components/FormularioOrden';
import ListaOrdenes from './components/ListaOrdenes';
const API_URL = 'https://pupuseria-1.onrender.com';

function App() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarOrdenes = () => {
    axios.get(`${API_URL}/ordenes`)
      .then(res => {
        setOrdenes(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar ordenes:', err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  return (
    <>
      <header className="hero">
        <span className="hero-eyebrow">🫓 El auténtico sabor salvadoreño</span>
        <h1>Sistema de Gestión <span>Pupusería</span></h1>
        <p>Registra, consulta y administra los pedidos de tus clientes en un solo lugar.</p>
      </header>

      <main className="container">
        {/* Pasamos la función cargarOrdenes al formulario para que refresque la lista al guardar */}
        <FormularioOrden onOrdenAgregada={cargarOrdenes} />

        {cargando ? (
          <p className="loading">Cargando órdenes de pupusas...</p>
        ) : (
          <ListaOrdenes ordenes={ordenes} onUpdate={cargarOrdenes} />
        )}
      </main>
    </>
  );
}

export default App;