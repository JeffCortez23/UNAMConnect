import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loaderService.showLoader() || forceShow()) {
      <div class="loader-overlay d-flex flex-column align-items-center justify-content-center">
        <div class="glass-loader-card d-flex flex-column align-items-center justify-content-center p-5">
          <div class="spinner-neon"></div>
          <p class="mt-4 loader-text">{{ message() }}</p>
        </div>
      </div>
    }
  `,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loaderService = inject(LoaderService);
  
  // Opciones configurables como inputs
  message = input<string>('Por favor espera...');
  forceShow = input<boolean>(false);
}
