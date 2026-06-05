const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar usuario por correo
    const { rows } = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar Token JWT
    const secret = process.env.JWT_SECRET || 'unamconnect_secret_key_2026';
    const token = jwt.sign(
      { id: usuario.id_usuario, correo: usuario.correo },
      secret,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const registro = async (req, res) => {
  const { id_carrera, codigo_univ, nombres, apellidos, correo, password } = req.body;

  try {
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await db.query(
      'INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario, correo',
      [id_carrera, codigo_univ, nombres, apellidos, correo, hashedPassword]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: rows[0]
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

module.exports = {
  login,
  registro
};
