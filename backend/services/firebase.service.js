const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const { cert } = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');

// Inicializar Firebase Admin SDK
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    // Producción (Render): usar variables de entorno
    // Nota: firebase-admin v14+ eliminó el namespace 'credential'; se usa la exportación directa 'cert'
    admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Limpieza defensiva: quita comillas/espacios alrededor (por si se pega con comillas en Render)
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/^["'\s]+|["'\s]+$/g, '').replace(/\\n/g, '\n')
      })
    });
    console.log('[Firebase Admin] Inicializado exitosamente en producción (variables de entorno).');
  } else {
    // Desarrollo local: usar archivo JSON
    const serviceAccountPath = path.join(__dirname, '../config/firebase-service-account.json');
    admin.initializeApp({
      credential: cert(require(serviceAccountPath))
    });
    console.log('[Firebase Admin] Inicializado exitosamente en desarrollo local.');
  }
} catch (error) {
  console.error('[Firebase Admin] Error al inicializar:', error);
}

// Obtener las llaves públicas de Google para verificar el ID Token de Firebase
const getGooglePublicKeys = async () => {
  const now = Date.now();
  if (cachedKeys && now < keysExpiryTime) {
    return cachedKeys;
  }

  try {
    const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    const cacheControl = response.headers.get('cache-control');
    let maxAge = 3600; // default 1 hour cache

    if (cacheControl) {
      const match = cacheControl.match(/max-age=(\d+)/);
      if (match) {
        maxAge = parseInt(match[1], 10);
      }
    }

    const data = await response.json();
    cachedKeys = data;
    keysExpiryTime = now + (maxAge * 1000);
    return cachedKeys;
  } catch (error) {
    console.error('Error al descargar llaves públicas de Firebase:', error);
    throw new Error('No se pudieron recuperar las llaves públicas de Firebase.');
  }
};

let cachedKeys = null;
let keysExpiryTime = 0;

// Verificar el ID Token
const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error('ID Token faltante.');
  }

  // Decodificar el token sin verificar para extraer la cabecera (kid)
  const decodedToken = jwt.decode(idToken, { complete: true });
  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
    throw new Error('Token de Firebase inválido o malformado.');
  }

  const kid = decodedToken.header.kid;
  const publicKeys = await getGooglePublicKeys();
  const publicKey = publicKeys[kid];

  if (!publicKey) {
    throw new Error('Llave pública de firma no encontrada.');
  }

  const projectId = 'unamconnect-portal-2026';

  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      publicKey,
      {
        algorithms: ['RS256'],
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`
      },
      (err, decoded) => {
        if (err) {
          reject(new Error(`Token de Firebase inválido: ${err.message}`));
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

// Actualizar la contraseña de un usuario en Firebase
const updateUserPassword = async (email, newPassword) => {
  try {
    const authInstance = getAuth();
    const userRecord = await authInstance.getUserByEmail(email);
    await authInstance.updateUser(userRecord.uid, {
      password: newPassword
    });
    console.log(`[Firebase Admin] Contraseña actualizada para el usuario: ${email}`);
    return userRecord;
  } catch (error) {
    console.error(`[Firebase Admin] Error al actualizar contraseña para ${email}:`, error);
    throw error;
  }
};

// Marcar el correo de un usuario como verificado en Firebase
const setUserEmailVerified = async (email) => {
  try {
    const authInstance = getAuth();
    const userRecord = await authInstance.getUserByEmail(email);
    await authInstance.updateUser(userRecord.uid, {
      emailVerified: true
    });
    console.log(`[Firebase Admin] Correo marcado como verificado para: ${email}`);
    return userRecord;
  } catch (error) {
    console.error(`[Firebase Admin] Error al marcar correo verificado para ${email}:`, error);
    throw error;
  }
};

module.exports = {
  verifyFirebaseIdToken,
  updateUserPassword,
  setUserEmailVerified
};
