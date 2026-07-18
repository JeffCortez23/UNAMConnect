const Auth = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { enviarCorreoCodigo } = require('../services/email.service');
const { verifyFirebaseIdToken, updateUserPassword, setUserEmailVerified } = require('../services/firebase.service');

// ── Mapas en memoria para códigos temporales ──
const resetCodes = new Map();
const verificationCodes = new Map();

// Limpieza periódica automática de códigos expirados para evitar fugas de memoria
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of resetCodes.entries()) {
    if (value.expiresAt < now) {
      resetCodes.delete(key);
    }
  }
  for (const [key, value] of verificationCodes.entries()) {
    if (value.expiresAt < now) {
      verificationCodes.delete(key);
    }
  }
}, 5 * 60 * 1000); // Cada 5 minutos

// Genera un código numérico de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Duración de validez: 5 minutos
const CODE_TTL_MS = 5 * 60 * 1000;

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar usuario por correo
    const usuario = await Auth.findByCorreo(correo);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar Token JWT
    const secret = process.env.JWT_SECRET;
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
        correo: usuario.correo,
        id_carrera: usuario.id_carrera,
        nombre_carrera: usuario.nombre_carrera,
        ciclo_actual: usuario.ciclo_actual,
        ano_ingreso: usuario.ano_ingreso,
        cursos_aprobados: usuario.cursos_aprobados
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const registro = async (req, res) => {
  const { idToken, id_carrera, codigo_univ, nombres, apellidos, correo, ano_ingreso, ciclo_actual, cursos_aprobados, url_historial_academico } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'ID Token de Firebase es requerido.' });
  }

  try {
    // Verificar token en Firebase
    const decodedToken = await verifyFirebaseIdToken(idToken);
    
    // Validar que el correo verificado de Firebase coincida con el correo del cuerpo
    if (decodedToken.email !== correo) {
      return res.status(400).json({ error: 'El correo del token no coincide con el correo de registro.' });
    }

    // Comprobar si el correo ya está registrado en PostgreSQL
    const usuarioExistente = await Auth.findByCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Hash de una contraseña ficticia segura para PostgreSQL
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('firebase_auth_' + Math.random().toString(36), salt);

    const nuevoUsuario = await Auth.register({
      id_carrera,
      codigo_univ,
      nombres,
      apellidos,
      correo,
      password: hashedPassword,
      ano_ingreso,
      ciclo_actual,
      cursos_aprobados,
      url_historial_academico
    });

    // Asignar el rol de 'alumno' (id_rol = 1) de forma predeterminada
    await db.query(
      'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES ($1, 1)',
      [nuevoUsuario.id_usuario]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado y verificado con éxito',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en registro con Firebase:', error);
    res.status(500).json({ error: error.message || 'Error al registrar usuario.' });
  }
};

// ── Forgot Password ─────────────────────────────────
const forgotPassword = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: 'El correo es requerido.' });
  }

  try {
    const usuario = await Auth.findByCorreo(correo);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado en la base de datos de UNAMConnect.' });
    }

    const code = generateCode();
    resetCodes.set(correo, { code, expiresAt: Date.now() + CODE_TTL_MS });

    console.log(`[UNAM Connect] Código de recuperación enviado a ${correo}`);

    // Enviar correo electrónico real usando Nodemailer
    await enviarCorreoCodigo(correo, 'Recuperación de Contraseña - UNAMConnect', code, 'recovery');

    res.json({ mensaje: 'Se ha enviado un código de verificación a tu correo electrónico.' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// ── Verify Reset Code ──────────────────────────────
const verifyResetCode = async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ error: 'Correo y código son requeridos.' });
  }

  try {
    const stored = resetCodes.get(correo);

    if (!stored) {
      return res.status(400).json({ error: 'No se encontró un código de recuperación para este correo.' });
    }

    if (Date.now() > stored.expiresAt) {
      resetCodes.delete(correo);
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
    }

    if (stored.code !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto.' });
    }

    res.json({ mensaje: 'Código verificado exitosamente.' });
  } catch (error) {
    console.error('Error en verifyResetCode:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// ── Reset Password ──────────────────────────────────
const resetPassword = async (req, res) => {
  const { correo, codigo, newPassword } = req.body;

  if (!correo || !codigo || !newPassword) {
    return res.status(400).json({ error: 'Correo, código y nueva contraseña son requeridos.' });
  }

  try {
    const stored = resetCodes.get(correo);

    if (!stored) {
      return res.status(400).json({ error: 'No se encontró un código de recuperación para este correo.' });
    }

    if (Date.now() > stored.expiresAt) {
      resetCodes.delete(correo);
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
    }

    if (stored.code !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto.' });
    }

    // Actualizar en Firebase Auth mediante Admin SDK
    await updateUserPassword(correo, newPassword);

    // Hash de la nueva contraseña y actualizar en BD local
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE usuarios SET password = $1 WHERE correo = $2', [hashedPassword, correo]);

    resetCodes.delete(correo);

    res.json({ mensaje: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor al restablecer contraseña.' });
  }
};

// ── Send Verification Code ─────────────────────────
const sendVerification = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: 'El correo es requerido.' });
  }

  try {
    const code = generateCode();
    verificationCodes.set(correo, { code, expiresAt: Date.now() + CODE_TTL_MS });

    console.log(`[UNAM Connect] Código de verificación enviado a ${correo}`);

    // Enviar correo electrónico real usando Nodemailer
    await enviarCorreoCodigo(correo, 'Verificación de Correo - UNAMConnect', code, 'verification');

    res.json({ mensaje: 'Código de verificación enviado.' });
  } catch (error) {
    console.error('Error en sendVerification:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// ── Verify Email ────────────────────────────────────
const verifyEmail = async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ error: 'Correo y código son requeridos.' });
  }

  try {
    const stored = verificationCodes.get(correo);

    if (!stored) {
      return res.status(400).json({ error: 'No se encontró un código de verificación para este correo.' });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(correo);
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
    }

    if (stored.code !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto.' });
    }

    // Actualizar estado del usuario en Firebase Auth mediante Admin SDK
    await setUserEmailVerified(correo);

    verificationCodes.delete(correo);

    res.json({ mensaje: 'Correo electrónico verificado exitosamente.' });
  } catch (error) {
    console.error('Error en verifyEmail:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor al verificar correo.' });
  }
};

const loginFirebase = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'ID Token de Firebase es requerido.' });
  }

  try {
    const decodedToken = await verifyFirebaseIdToken(idToken);
    const correo = decodedToken.email;

    // Buscar usuario en PostgreSQL
    const usuario = await Auth.findByCorreo(correo);
    if (!usuario) {
      return res.status(404).json({ error: 'Tu cuenta de correo no está registrada en el sistema de UNAMConnect. Regístrate primero.' });
    }

    // Generar nuestro propio Token JWT local para el resto de peticiones del backend
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: usuario.id_usuario, correo: usuario.correo },
      secret,
      { expiresIn: '8h' }
    );

    const rolesQuery = await db.query(
      `SELECT r.nombre_rol 
       FROM usuario_roles ur
       JOIN roles r ON ur.id_rol = r.id_rol
       WHERE ur.id_usuario = $1`,
      [usuario.id_usuario]
    );
    const roles = rolesQuery.rows.map(row => row.nombre_rol);

    res.json({
      mensaje: 'Login exitoso vía Firebase',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        id_carrera: usuario.id_carrera,
        nombre_carrera: usuario.nombre_carrera,
        ciclo_actual: usuario.ciclo_actual,
        ano_ingreso: usuario.ano_ingreso,
        roles: roles,
        cursos_aprobados: usuario.cursos_aprobados
      }
    });
  } catch (error) {
    console.error('Error en loginFirebase:', error);
    res.status(401).json({ error: error.message || 'Token de Firebase inválido o expirado.' });
  }
};

const checkAvailability = async (req, res) => {
  const { email, code } = req.query;
  try {
    let emailExists = false;
    let codeExists = false;

    if (email) {
      const emailResult = await db.query('SELECT 1 FROM usuarios WHERE LOWER(correo) = LOWER($1)', [email.trim()]);
      emailExists = emailResult.rows.length > 0;
    }

    if (code) {
      const codeResult = await db.query('SELECT 1 FROM usuarios WHERE codigo_univ = $1', [code.trim()]);
      codeExists = codeResult.rows.length > 0;
    }

    res.json({ emailExists, codeExists });
  } catch (error) {
    console.error('Error en checkAvailability:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
};

module.exports = {
  login,
  registro,
  loginFirebase,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  sendVerification,
  verifyEmail,
  checkAvailability
};
