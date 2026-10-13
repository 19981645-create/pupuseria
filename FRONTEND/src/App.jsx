import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioConsulta from './components/FormularioConsulta';
import ListaConsultas from './components/ListaConsultas';

const API_URL = 'https://veterinaria-6svw.onrender.com';

function App() {
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarConsultas = () => {
    axios.get(`${API_URL}/consultas`)
      .then(res => {
        setConsultas(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar consultas:', err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  return (
    <>
      <header className="hero">
        <span className="hero-eyebrow">🐾 Cuidamos a tu mejor amigo</span>
        <h1>Sistema de Gestión <span>Veterinaria</span></h1>
        <p>Registra, consulta y administra las consultas médicas de tus pacientes en un solo lugar.</p>
      </header>

      <main className="container">
        {/* Pasamos la función cargarConsultas al formulario para que refresque la lista al guardar */}
        <FormularioConsulta onConsultaAgregada={cargarConsultas} />

        {cargando ? (
          <p className="loading">Cargando consultas médicas...</p>
        ) : (
          <ListaConsultas consultas={consultas} onUpdate={cargarConsultas} />
        )}
      </main>
    </>
  );
}

export default App;
