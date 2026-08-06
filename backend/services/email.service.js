const nodemailer = require('nodemailer');

// Configuración del transportador utilizando variables de entorno
// Se preconfigura con soporte SMTP genérico y fallback a un correo de prueba de Gmail
// Gmail SMTP: puerto 587 con STARTTLS (más compatible desde nubes como Render que el 465 SSL)
// Timeouts cortos: si el SMTP no responde, la petición falla en ~15s en lugar de colgarse ~2 minutos.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // STARTTLS
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000
});

const enviarCorreoCodigo = async (destinatario, asunto, codigo, type = 'verification') => {
  const isVerification = type === 'verification';
  const title = isVerification ? '¡Activa tu cuenta de UNAMConnect! 🎓' : 'Recuperación de Contraseña 🔒';
  const subtitle = isVerification ? 'Portal de Tutorías Académicas' : 'Restablecimiento de acceso';
  const icon = isVerification ? '🎓' : '🔒';
  const introText = isVerification 
    ? 'Para completar tu registro en el Portal de Tutorías de la Universidad Nacional de Moquegua y comenzar a agendar tus asesorías, utiliza el siguiente código de verificación:'
    : 'Recibimos una solicitud para restablecer tu contraseña en UNAMConnect. Utiliza el siguiente código para completar la acción:';
  const footnote = isVerification
    ? 'Si no has solicitado registrarte en UNAMConnect, puedes ignorar con seguridad este correo.'
    : 'Si tú no solicitaste este cambio, por favor ignora este mensaje para mantener tu cuenta protegida.';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 10px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e5e7eb; text-align: left;">
        
        <!-- Encabezado Branded -->
        <div style="background-color: #191438; padding: 30px; text-align: center; color: #ffffff;">
          <span style="font-size: 48px; display: block; margin-bottom: 10px;">${icon}</span>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">${title}</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #61C6C0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${subtitle}</p>
        </div>

        <!-- Contenido -->
        <div style="padding: 30px 40px; color: #334155; line-height: 1.6;">
          <p style="font-size: 15px; font-weight: 600; margin-top: 0; color: #1e293b;">Hola,</p>
          <p style="font-size: 14px; margin-bottom: 25px; color: #475569;">${introText}</p>
          
          <!-- Código de Verificación -->
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; font-size: 32px; font-weight: 700; color: #191438; background: #f1f5f9; padding: 12px 30px; border-radius: 8px; letter-spacing: 5px; border: 1px dashed #61C6C0;">
              ${codigo}
            </div>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 10px; font-style: italic;">Este código expira en 15 minutos.</p>
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 30px;">${footnote}</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Atentamente,<br>
            <strong>El equipo de UNAMConnect</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"UNAMConnect Portal" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoCodigo };
