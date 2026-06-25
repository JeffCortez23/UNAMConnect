import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Inicializar el tema desde localStorage o el esquema de colores del sistema
  theme = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    // Escuchar cambios de la señal para aplicar la clase en el body
    effect(() => {
      const currentTheme = this.theme();
      const body = document.body;
      
      if (currentTheme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
      }
      
      localStorage.setItem('unam-theme', currentTheme);
    });
  }

  toggleTheme(): void {
    const nextTheme = () => {
      const current = this.theme();
      const target = current === 'light' ? 'dark' : 'light';
      
      // Modificar el DOM de forma síncrona dentro del callback de transición para que el navegador lo capture
      const body = document.body;
      if (target === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
      }

      this.theme.set(target);
    };

    if (!(document as any).startViewTransition) {
      nextTheme();
    } else {
      (document as any).startViewTransition(nextTheme);
    }
  }

  private getInitialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('unam-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Si no está guardado, usar la preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
