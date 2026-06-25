import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="forgot-password-view animate-fade-in d-flex flex-column gap-3">
      <button type="button" class="back-btn" (click)="close.emit()">
        <i class="bi bi-chevron-left"></i>
        Volver al inicio de sesión
      </button>

      <div class="form-header animate-slide-up delay-1">
        <h2 class="fw-bold mb-1">Recuperar contraseña</h2>
        @if (forgotStep() === 1) {
          <p class="text-theme-muted mb-0">Te enviaremos un código de recuperación de 6 dígitos a tu correo {{ isModeratorMode ? 'electrónico' : 'institucional' }}</p>
        } @else if (forgotStep() === 2) {
          <p class="text-theme-muted mb-0">Ingresa el código OTP enviado a tu correo para verificar tu identidad</p>
        } @else {
          <p class="text-theme-muted mb-0">Define tu nueva contraseña y confírmala para completar el proceso</p>
        }
      </div>

      <!-- Step 1: Enter email and send reset link -->
      @if (forgotStep() === 1) {
        <div class="forgot-form animate-slide-up delay-2">
          <div class="form-group">
            <label>{{ isModeratorMode ? 'CORREO ELECTRÓNICO' : 'CORREO INSTITUCIONAL' }}</label>
            <div class="input-wrapper">
              <i class="bi bi-envelope icon-left"></i>
              <input
                type="email"
                [ngModel]="forgotEmail()"
                (ngModelChange)="forgotEmail.set($event)"
                [ngModelOptions]="{standalone: true}"
                [placeholder]="isModeratorMode ? 'ejemplo@correo.com' : 'usuario@unam.edu.pe'"
                autocomplete="email">
            </div>
          </div>

          <button type="button" class="btn-submit" [disabled]="forgotLoading()" (click)="sendResetCode()">
            @if (forgotLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span>Enviando código...</span>
            } @else {
              <span>Enviar código de recuperación</span>
            }
          </button>
        </div>
      }

      <!-- Step 2: Verification of OTP -->
      @if (forgotStep() === 2) {
        <div class="forgot-form animate-slide-up delay-2">
          <div class="form-group">
            <label>CÓDIGO DE VERIFICACIÓN (OTP)</label>
            <div class="input-wrapper">
              <i class="bi bi-shield-lock icon-left"></i>
              <input
                type="text"
                [ngModel]="otpCode()"
                (ngModelChange)="otpCode.set($event)"
                [ngModelOptions]="{standalone: true}"
                placeholder="123456"
                maxlength="6">
            </div>
          </div>

          <button type="button" class="btn-submit" [disabled]="forgotLoading()" (click)="verifyOtpCode()">
            @if (forgotLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span>Verificando...</span>
            } @else {
              <span>Verificar código OTP</span>
            }
          </button>
        </div>
      }

      <!-- Step 3: Change Password -->
      @if (forgotStep() === 3) {
        <div class="forgot-form animate-slide-up delay-2">
          <div class="form-group">
            <label>NUEVA CONTRASEÑA</label>
            <div class="input-wrapper">
              <i class="bi bi-lock icon-left"></i>
              <input
                type="password"
                [ngModel]="newPassword()"
                (ngModelChange)="newPassword.set($event)"
                [ngModelOptions]="{standalone: true}"
                placeholder="Mínimo 8 caracteres">
            </div>
          </div>

          <div class="form-group">
            <label>CONFIRMAR NUEVA CONTRASEÑA</label>
            <div class="input-wrapper">
              <i class="bi bi-lock icon-left"></i>
              <input
                type="password"
                [ngModel]="confirmNewPassword()"
                (ngModelChange)="confirmNewPassword.set($event)"
                [ngModelOptions]="{standalone: true}"
                placeholder="Repite tu contraseña">
            </div>
          </div>

          <button type="button" class="btn-submit" [disabled]="forgotLoading()" (click)="confirmResetPassword()">
            @if (forgotLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span>Restableciendo...</span>
            } @else {
              <span>Restablecer contraseña</span>
            }
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(NotificationService);

  @Input() isModeratorMode: boolean = false;
  @Input() initialEmail: string = '';
  @Output() close = new EventEmitter<void>();

  forgotEmail = signal('');
  forgotLoading = signal(false);
  forgotStep = signal<1 | 2 | 3>(1);
  otpCode = signal('');
  newPassword = signal('');
  confirmNewPassword = signal('');

  ngOnInit(): void {
    this.forgotEmail.set(this.initialEmail);
  }

  sendResetCode(): void {
    const email = this.forgotEmail().trim().toLowerCase();
    if (!email) {
      this.toast.showToast('Ingresa tu correo institucional.', 'error');
      return;
    }

    this.forgotLoading.set(true);
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.forgotLoading.set(false);
        this.forgotStep.set(2);
        this.toast.showToast(res.mensaje || 'Código de recuperación enviado. Revisa tu correo.', 'success');
      },
      error: (err) => {
        this.forgotLoading.set(false);
        console.error('Error al solicitar recuperación:', err);
        const errorMsg = err.error?.error || 'Error al enviar el código de recuperación.';
        this.toast.showToast(errorMsg, 'error');
      }
    });
  }

  verifyOtpCode(): void {
    const email = this.forgotEmail().trim().toLowerCase();
    const code = this.otpCode().trim();

    if (!code || code.length !== 6) {
      this.toast.showToast('Ingresa el código OTP de 6 dígitos.', 'error');
      return;
    }

    this.forgotLoading.set(true);
    this.authService.verifyResetCode(email, code).subscribe({
      next: (res) => {
        this.forgotLoading.set(false);
        this.forgotStep.set(3);
        this.toast.showToast(res.mensaje || 'Código verificado con éxito.', 'success');
      },
      error: (err) => {
        this.forgotLoading.set(false);
        console.error('Error al verificar OTP:', err);
        const errorMsg = err.error?.error || 'Código de verificación incorrecto o expirado.';
        this.toast.showToast(errorMsg, 'error');
      }
    });
  }

  confirmResetPassword(): void {
    const email = this.forgotEmail().trim().toLowerCase();
    const code = this.otpCode().trim();
    const newPwd = this.newPassword();
    const confirmPwd = this.confirmNewPassword();

    if (!newPwd || newPwd.length < 8) {
      this.toast.showToast('La nueva contraseña debe tener al menos 8 caracteres.', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      this.toast.showToast('Las contraseñas no coinciden.', 'error');
      return;
    }

    this.forgotLoading.set(true);
    this.authService.resetPassword({ correo: email, codigo: code, newPassword: newPwd }).subscribe({
      next: (res) => {
        this.forgotLoading.set(false);
        this.toast.showToast(res.mensaje || 'Contraseña restablecida correctamente.', 'success');
        this.close.emit();
      },
      error: (err) => {
        this.forgotLoading.set(false);
        console.error('Error al restablecer contraseña:', err);
        const errorMsg = err.error?.error || 'Error al actualizar la contraseña.';
        this.toast.showToast(errorMsg, 'error');
      }
    });
  }
}
