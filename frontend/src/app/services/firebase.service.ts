import { Injectable } from '@angular/core';
import { auth, storage } from '../config/firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  /**
   * Envía un correo de restablecimiento de contraseña usando Firebase Auth
   * @param email Correo electrónico del usuario
   */
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Sube un archivo a Firebase Storage y devuelve su URL de descarga
   * @param path Ruta de destino en Storage (ej: 'boletas/archivo.pdf')
   * @param file El objeto File HTML5 a subir
   */
  async uploadFile(path: string, file: File): Promise<string> {
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  }
}
