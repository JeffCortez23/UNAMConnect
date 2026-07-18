import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard inverso al authGuard: protege rutas públicas (login, register).
 * Si el usuario YA tiene una sesión activa con token válido,
 * espera a que los roles se carguen y lo redirige a su dashboard.
 */
export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true; // No está logueado → permitir acceso al login/register
  }

  // Esperar a que los roles se carguen desde el backend
  await authService.rolesReady;

  const userRoles = authService.userRoles().map(r => r.nombre_rol);

  if (userRoles.includes('moderador')) {
    return router.createUrlTree(['/dashboard/moderator']);
  } else if (userRoles.includes('tutor')) {
    return router.createUrlTree(['/dashboard/tutor']);
  } else {
    return router.createUrlTree(['/dashboard']);
  }
};
