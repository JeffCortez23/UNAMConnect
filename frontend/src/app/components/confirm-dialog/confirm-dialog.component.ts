import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="dialog-overlay d-flex align-items-center justify-content-center">
        <div class="glass-dialog-card p-4">
          <div class="dialog-header d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
            <h5 class="dialog-title m-0">{{ title() }}</h5>
          </div>
          <div class="dialog-body mb-4">
            <p class="dialog-message">{{ message() }}</p>
          </div>
          <div class="dialog-footer d-flex justify-content-end gap-2">
            <button class="btn btn-glass-cancel" (click)="cancel()">{{ cancelText() }}</button>
            <button class="btn btn-glass-confirm" (click)="confirm()">{{ confirmText() }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  // Inputs configurables
  isOpen = input<boolean>(false);
  title = input<string>('Confirmación');
  message = input<string>('¿Estás seguro de que deseas realizar esta acción?');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');

  // Outputs para emitir la acción del usuario
  onConfirm = output<void>();
  onCancel = output<void>();

  confirm(): void {
    this.onConfirm.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
