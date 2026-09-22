// src/models/criticoModel.js
const pool = require('../config/db');

const CriticoModel = {
  async crear({ nombre, email, password, medioPublicacion, biografia }) {
    const [result] = await pool.query(
      `INSERT INTO criticos (nombre, email, password, medio_publicacion, biografia)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, password, medioPublicacion || null, biografia || null]
    );
    return result.insertId;
  },

  async obtenerTodos() {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, medio_publicacion, biografia, fecha_registro
       FROM criticos`
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, medio_publicacion, biografia, fecha_registro
       FROM criticos WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async obtenerPorEmail(email) {
    // Incluye password porque este método se usa también para login
    const [rows] = await pool.query(`SELECT * FROM criticos WHERE email = ?`, [email]);
    return rows[0];
  },

  async actualizar(id, { nombre, email, password, medioPublicacion, biografia }) {
    const [result] = await pool.query(
      `UPDATE criticos SET
         nombre = COALESCE(?, nombre),
         email = COALESCE(?, email),
         password = COALESCE(?, password),
         medio_publicacion = COALESCE(?, medio_publicacion),
         biografia = COALESCE(?, biografia)
       WHERE id = ?`,
      [nombre, email, password, medioPublicacion, biografia, id]
    );
    return result.affectedRows;
  },

  async eliminar(id) {
    const [result] = await pool.query(`DELETE FROM criticos WHERE id = ?`, [id]);
    return result.affectedRows;
  }
};

module.exports = CriticoModel;
