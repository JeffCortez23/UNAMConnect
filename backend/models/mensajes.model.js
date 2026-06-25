const db = require('../config/db');

const Mensajes = {
  getChat: async (id_usuario1, id_usuario2) => {
    // Marcar como leídos los mensajes que id_usuario2 (emisor) envió a id_usuario1 (receptor)
    await db.query(
      `UPDATE mensajes SET leido = true 
       WHERE id_emisor = $2 AND id_receptor = $1 AND leido = false`,
      [id_usuario1, id_usuario2]
    );

    const { rows } = await db.query(
      `SELECT m.*, 
              u_emisor.nombres AS emisor_nombres, u_emisor.apellidos AS emisor_apellidos,
              u_receptor.nombres AS receptor_nombres, u_receptor.apellidos AS receptor_apellidos
       FROM mensajes m
       JOIN usuarios u_emisor ON m.id_emisor = u_emisor.id_usuario
       JOIN usuarios u_receptor ON m.id_receptor = u_receptor.id_usuario
       WHERE (id_emisor = $1 AND id_receptor = $2) 
          OR (id_emisor = $2 AND id_receptor = $1)
       ORDER BY fecha_envio ASC`,
      [id_usuario1, id_usuario2]
    );
    return rows;
  },

  getConversaciones: async (id_usuario) => {
    // Obtener los usuarios con los que el usuario ha hablado, incluyendo contador de no leídos
    const { rows } = await db.query(
      `SELECT DISTINCT u.id_usuario, u.nombres, u.apellidos, u.correo,
              (SELECT COUNT(*)::int FROM mensajes 
               WHERE id_emisor = u.id_usuario AND id_receptor = $1 AND leido = false) AS mensajes_sin_leer
       FROM usuarios u
       WHERE u.id_usuario IN (
         SELECT DISTINCT CASE 
           WHEN id_emisor = $1 THEN id_receptor 
           ELSE id_emisor 
         END
         FROM mensajes
         WHERE id_emisor = $1 OR id_receptor = $1
       )`,
      [id_usuario]
    );
    return rows;
  },

  getConversacionesFiltradas: async (id_usuario, filterRoleName) => {
    const { rows } = await db.query(
      `SELECT DISTINCT u.id_usuario, u.nombres, u.apellidos, u.correo,
              (SELECT COUNT(*)::int FROM mensajes 
               WHERE id_emisor = u.id_usuario AND id_receptor = $1 AND leido = false) AS mensajes_sin_leer
       FROM usuarios u
       JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
       JOIN roles r ON ur.id_rol = r.id_rol
       WHERE r.nombre_rol = $2 AND u.id_usuario IN (
         SELECT DISTINCT CASE 
           WHEN id_emisor = $1 THEN id_receptor 
           ELSE id_emisor 
         END
         FROM mensajes
         WHERE id_emisor = $1 OR id_receptor = $1
       )`,
      [id_usuario, filterRoleName]
    );
    return rows;
  },

  create: async (mensajeData) => {
    const { id_emisor, id_receptor, contenido } = mensajeData;
    const { rows } = await db.query(
      `INSERT INTO mensajes (id_emisor, id_receptor, contenido) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [id_emisor, id_receptor, contenido]
    );
    return rows[0];
  }
};

module.exports = Mensajes;
