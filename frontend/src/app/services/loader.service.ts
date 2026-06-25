import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isVisible = signal(false);

  // Getter de solo lectura para el estado
  readonly showLoader = this.isVisible.asReadonly();

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }
}
