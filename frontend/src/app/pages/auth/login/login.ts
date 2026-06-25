import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { auth } from '../../../config/firebase.config';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { BYPASS_EMAILS } from '../../../config/bypass-emails.config';
import { CarouselComponent } from './carousel.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CarouselComponent, ForgotPasswordComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(NotificationService);

  // Login form
  correo = signal('');
  password = signal('');
  selectedRol = signal<'alumno' | 'tutor' | 'moderador'>('alumno');
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);
  showPassword = signal(false);
  isModeratorMode = signal(false);
  isCycleActive = signal(true);
  currentCycle = signal('');
  showForgotPassword = signal(false);

  ngOnInit(): void {
    const now = new Date();
    this.currentCycle.set(this.getAcademicCycleString(now));
  }

  toggleModeratorMode(enable: boolean): void {
    this.isModeratorMode.set(enable);
    this.selectedRol.set(enable ? 'moderador' : 'alumno');
    this.errorMessage.set(null);
    this.correo.set('');
    this.password.set('');
  }

  onCorreoChange(val: string): void {
    this.correo.set(val);
    const email = val.trim().toLowerCase();
    
    if (this.isModeratorMode()) {
      this.selectedRol.set('moderador');
      return;
    }
    
    if (email.includes('@unam.edu.pe')) {
      const prefix = email.split('@')[0];
      if (/^\d+/.test(prefix)) {
        this.selectedRol.set('alumno');
      } else {
        if (prefix === 'admin' || prefix === 'moderador' || prefix === 'renzo.cortez') {
          this.selectedRol.set('alumno');
        } else {
          this.selectedRol.set('tutor');
        }
      }
    }
  }

  private getAcademicCycleString(date: Date): string {
    const year = date.getFullYear();
    const firstMondayOfApril = this.getFirstMondayOfMonth(year, 3); // April
    const lastFridayOfJuly = this.getLastFridayOfMonth(year, 6); // July
    const firstMondayOfSeptember = this.getFirstMondayOfMonth(year, 8); // September
    const endOfSemestreII = new Date(year, 11, 26, 23, 59, 59); // December 26th

    if (date < firstMondayOfApril) {
      this.isCycleActive.set(false);
      return `Ciclo ${year}-I`;
    } else if (date <= lastFridayOfJuly) {
      this.isCycleActive.set(true);
      return `Ciclo ${year}-I`;
    } else if (date < firstMondayOfSeptember) {
      this.isCycleActive.set(false);
      return `Ciclo ${year}-II`;
    } else if (date <= endOfSemestreII) {
      this.isCycleActive.set(true);
      return `Ciclo ${year}-II`;
    } else {
      this.isCycleActive.set(false);
      return `Ciclo ${year + 1}-I`;
    }
  }

  private getFirstMondayOfMonth(year: number, month: number): Date {
    const d = new Date(year, month, 1);
    while (d.getDay() !== 1) { // 1 = Monday
      d.setDate(d.getDate() + 1);
    }
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getLastFridayOfMonth(year: number, month: number): Date {
    const d = new Date(year, month + 1, 0);
    while (d.getDay() !== 5) { // 5 = Friday
      d.setDate(d.getDate() - 1);
    }
    d.setHours(23, 59, 59, 999);
    return d;
  }

  setRol(rol: 'alumno' | 'tutor' | 'moderador'): void {
    this.selectedRol.set(rol);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.correo() || !this.password()) {
      this.errorMessage.set('Por favor, rellene todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const email = this.correo().trim().toLowerCase();
    const password = this.password();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const isBypassUser = BYPASS_EMAILS.has(email);
        
        if (!user.emailVerified && !isBypassUser) {
          this.isLoading.set(false);
          this.errorMessage.set('Tu correo institucional aún no ha sido verificado. Te enviamos un nuevo enlace.');
          this.toast.showToast('Correo no verificado.', 'error');
          await sendEmailVerification(user);
          auth.signOut();
          return;
        }

        const idToken = await user.getIdToken();

        this.authService.loginWithFirebase(idToken).subscribe({
          next: (res: any) => {
            this.isLoading.set(false);
            
            const rawRoles = res.usuario?.roles || [];
            const userRoles = rawRoles.map((name: any) => ({
              nombre_rol: typeof name === 'string' ? name : name.nombre_rol
            }));
            
            const chosenRol = this.selectedRol();
            const hasSelectedRole = userRoles.some((r: any) => r.nombre_rol === chosenRol);
            let targetRol = chosenRol;

            if (!hasSelectedRole) {
              if (userRoles.some((r: any) => r.nombre_rol === 'moderador')) {
                targetRol = 'moderador';
              } else if (userRoles.some((r: any) => r.nombre_rol === 'tutor')) {
                targetRol = 'tutor';
              } else if (userRoles.some((r: any) => r.nombre_rol === 'alumno')) {
                targetRol = 'alumno';
              } else {
                this.authService.logout();
                auth.signOut();
                const displayRoleName = chosenRol === 'alumno' ? 'Alumno' : chosenRol === 'tutor' ? 'Tutor' : 'Moderador';
                const errorMsg = `Esta cuenta no está registrada con el rol de ${displayRoleName}.`;
                this.errorMessage.set(errorMsg);
                this.toast.showToast(errorMsg, 'error');
                return;
              }
              this.selectedRol.set(targetRol);
            }

            this.toast.showToast('¡Bienvenido de vuelta!', 'success');
            if (targetRol === 'tutor') {
              this.router.navigate(['/dashboard/tutor']);
            } else if (targetRol === 'moderador') {
              this.router.navigate(['/dashboard/moderator']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            auth.signOut();
            this.errorMessage.set(err.error?.error || 'Tu cuenta no está registrada en el sistema.');
          }
        });
      })
      .catch((error) => {
        this.isLoading.set(false);
        console.error('Error de login Firebase:', error);
        let errorMsg = 'Credenciales incorrectas o error de conexión.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMsg = 'Correo o contraseña incorrectos.';
        }
        this.errorMessage.set(errorMsg);
        this.toast.showToast(errorMsg, 'error');
      });
  }

  openForgotPassword(): void {
    this.showForgotPassword.set(true);
  }

  closeForgotPassword(): void {
    this.showForgotPassword.set(false);
  }
}
