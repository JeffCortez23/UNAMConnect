import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  title: string;
  message: string;
  onConfirm: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Confirmación Modal
  confirmState = signal<{ show: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

  // Toast Exitoso/Error
  toastState = signal<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  showConfirm(config: ConfirmConfig): void {
    this.confirmState.set({
      show: true,
      title: config.title,
      message: config.message,
      onConfirm: () => {
        config.onConfirm();
        this.closeConfirm();
      }
    });
  }

  closeConfirm(): void {
    this.confirmState.set(null);
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastState.set({ show: true, message, type });
    // Ocultar automáticamente tras 3 segundos con transición
    setTimeout(() => {
      this.closeToast();
    }, 3000);
  }

  closeToast(): void {
    this.toastState.update(state => state ? { ...state, show: false } : null);
  }
}
