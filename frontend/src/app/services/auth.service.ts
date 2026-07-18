import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Usuario } from '../models';

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Signals para manejar el estado reactivo del usuario
  readonly currentUser = signal<Usuario | null>(null);
  readonly token = signal<string | null>(null);
  readonly userRoles = signal<any[]>([]);
  
  // Computada para saber si el usuario está autenticado
  readonly isAuthenticated = computed(() => this.token() !== null);

  constructor() {
    this.loadStorage();
  }

  private loadStorage(): void {
    const storedToken = localStorage.getItem('unamconnect_token');
    const storedUser = localStorage.getItem('unamconnect_user');

    if (storedToken && storedUser) {
      try {
        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('unamconnect_token');
          localStorage.removeItem('unamconnect_user');
          return;
        }
      } catch (e) {
        localStorage.removeItem('unamconnect_token');
        localStorage.removeItem('unamconnect_user');
        return;
      }

      this.token.set(storedToken);
      this.currentUser.set(JSON.parse(storedUser));
      this.loadUserRoles();
    }
  }

  /** Promise que se resuelve cuando los roles del usuario están cargados */
  rolesReady: Promise<void> = Promise.resolve();

  loadUserRoles(): void {
    const user = this.currentUser();
    if (!user) return;
    this.rolesReady = new Promise<void>((resolve) => {
      this.http.get<any[]>(`${this.apiUrl}/usuarios/${user.id}/roles`).subscribe({
        next: (roles) => { this.userRoles.set(roles); resolve(); },
        error: (err) => { console.error('Error al cargar roles de usuario:', err); resolve(); }
      });
    });
  }

  login(credentials: { correo: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('unamconnect_token', res.token);
          localStorage.setItem('unamconnect_user', JSON.stringify(res.usuario));
          this.token.set(res.token);
          this.currentUser.set(res.usuario);
          this.loadUserRoles();
        }
      })
    );
  }

  loginWithFirebase(idToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login-firebase`, { idToken }).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('unamconnect_token', res.token);
          localStorage.setItem('unamconnect_user', JSON.stringify(res.usuario));
          this.token.set(res.token);
          this.currentUser.set(res.usuario);
          if (res.usuario.roles) {
            const rolesMapped = res.usuario.roles.map((name: string) => ({
              id_rol: name === 'alumno' ? 1 : name === 'tutor' ? 2 : 3,
              nombre_rol: name
            }));
            this.userRoles.set(rolesMapped);
          } else {
            this.loadUserRoles();
          }
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }

  updateCurrentUser(updatedUser: any): void {
    const current = this.currentUser();
    if (!current) return;
    const merged = { ...current, ...updatedUser };
    localStorage.setItem('unamconnect_user', JSON.stringify(merged));
    this.currentUser.set(merged);
  }

  logout(): void {
    localStorage.removeItem('unamconnect_token');
    localStorage.removeItem('unamconnect_user');
    this.token.set(null);
    this.currentUser.set(null);
    this.userRoles.set([]);
    this.router.navigate(['/login']);
  }

  // --- Métodos de recuperación y verificación personalizados ---
  forgotPassword(correo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { correo });
  }

  verifyResetCode(correo: string, codigo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/verify-reset-code`, { correo, codigo });
  }

  resetPassword(payload: { correo: string; codigo: string; newPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, payload);
  }

  sendVerification(correo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/send-verification`, { correo });
  }

  verifyEmail(correo: string, codigo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/verify-email`, { correo, codigo });
  }
}
