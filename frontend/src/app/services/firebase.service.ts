import { Injectable, inject } from '@angular/core';
import { auth, storage } from '../config/firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly http = inject(HttpClient);

  /**
   * Envía un correo de restablecimiento de contraseña usando Firebase Auth
   * @param email Correo electrónico del usuario
   */
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Sube un archivo a Firebase Storage o al backend local y devuelve su URL de descarga
   * @param path Ruta de destino en Storage (ej: 'boletas/archivo.pdf')
   * @param file El objeto File HTML5 a subir
   */
  async uploadFile(path: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await firstValueFrom(
        this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData)
      );
      return res.url;
    } catch (err) {
      console.warn('Fallo la subida al servidor local, intentando con Firebase Storage...', err);
      const fileRef = ref(storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    }
  }
}
