const Mensajes = require('../models/mensajes.model');

const obtenerChat = async (req, res) => {
  try {
    const { id_usuario1, id_usuario2 } = req.params;
    const chat = await Mensajes.getChat(id_usuario1, id_usuario2);
    res.json(chat);
  } catch (error) {
    console.error('Error al obtener chat:', error);
    res.status(500).json({ error: 'Error al obtener chat' });
  }
};

const obtenerConversaciones = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rol } = req.query; // 'tutor' o 'alumno'

    let conversaciones;
    if (rol) {
      conversaciones = await Mensajes.getConversacionesFiltradas(id_usuario, rol);
    } else {
      conversaciones = await Mensajes.getConversaciones(id_usuario);
    }
    res.json(conversaciones);
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

const enviarMensaje = async (req, res) => {
  try {
    const { id_emisor, id_receptor, contenido } = req.body;
    if (!id_emisor || !id_receptor || !contenido) {
      return res.status(400).json({ error: 'Emisor, receptor y contenido son requeridos.' });
    }
    const nuevoMensaje = await Mensajes.create({ id_emisor, id_receptor, contenido });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

module.exports = {
  obtenerChat,
  obtenerConversaciones,
  enviarMensaje
};
