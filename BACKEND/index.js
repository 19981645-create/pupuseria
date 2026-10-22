require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'https://pupuseria-1-l12u.onrender.com', // O coloca la URL exacta de tu frontend en Render
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const conexion = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // Permite la conexión cifrada requerida por Aiven
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/', (req, res) => {
  res.send('API de la Pupusería funcionando correctamente en Render 🚀');
});

app.get('/ordenes', (req, res) => {
  const sql = `
    SELECT 
      o.id, 
      c.nombre AS cliente, 
      p.nombre AS pupusa, 
      p.especialidad, 
      o.detalle_pedido, 
      o.precio, 
      DATE_FORMAT(o.fecha, '%Y-%m-%d') AS fecha,
      o.cliente_id,
      o.pupusa_id
    FROM ordenes o
    LEFT JOIN clientes c ON o.cliente_id = c.id
    LEFT JOIN pupusas p ON o.pupusa_id = p.id
    ORDER BY o.id DESC
  `;

  conexion.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error SQL en /ordenes:', err);
      return res.status(500).json({ error: 'Error al obtener ordenes', detalle: err.message });
    }
    res.json(resultados);
  });
});

// GET /clientes y GET /pupusas
app.get('/clientes', (req, res) => {
  conexion.query('SELECT * FROM clientes', (err, r) => {
    if (err) {
      console.error('Error SQL en /clientes:', err);
      return res.status(500).json({ error: 'Error al obtener clientes', detalle: err.message });
    }
    res.json(r);
  });
});

app.get('/pupusas', (req, res) => {
  conexion.query('SELECT * FROM pupusas', (err, r) => {
    if (err) {
      console.error('Error SQL en /pupusas:', err);
      return res.status(500).json({ error: 'Error al obtener pupusas', detalle: err.message });
    }
    res.json(r);
  });
});

// POST /ordenes
app.post('/ordenes', (req, res) => {
  const { cliente_id, pupusa_id, detalle_pedido, precio, fecha } = req.body;
  
  conexion.query(
    'INSERT INTO ordenes (cliente_id, pupusa_id, detalle_pedido, precio, fecha) VALUES (?, ?, ?, ?, ?)',
    [cliente_id, pupusa_id, detalle_pedido, precio, fecha],
    (err, result) => {
      if (err) {
        console.error('Error SQL al registrar orden:', err);
        return res.status(500).json({ error: 'Error al registrar orden', detalle: err.message });
      }
      res.status(201).json({ message: 'Orden registrada correctamente', id: result.insertId });
    }
  );
});

// PUT /ordenes/:id (Actualizar orden)
app.put('/ordenes/:id', (req, res) => {
  const id = req.params.id;
  const { cliente_id, pupusa_id, detalle_pedido, precio, fecha } = req.body;

  conexion.query(
    'UPDATE ordenes SET cliente_id=?, pupusa_id=?, detalle_pedido=?, precio=?, fecha=? WHERE id=?',
    [cliente_id, pupusa_id, detalle_pedido, precio, fecha, id],
    (err) => {
      if (err) {
        console.error('Error SQL al actualizar orden:', err);
        return res.status(500).json({ error: 'Error al actualizar orden', detalle: err.message });
      }
      res.json({ message: `Orden con ID ${id} actualizada` });
    }
  );
});

// DELETE /ordenes/:id (Eliminar orden)
app.delete('/ordenes/:id', (req, res) => {
  const id = req.params.id;

  conexion.query('DELETE FROM ordenes WHERE id=?', [id], (err) => {
    if (err) {
      console.error('Error SQL al eliminar orden:', err);
      return res.status(500).json({ error: 'Error al eliminar orden', detalle: err.message });
    }
    res.json({ message: `Orden con ID ${id} eliminada` });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});