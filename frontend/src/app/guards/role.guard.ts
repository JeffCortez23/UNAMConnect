import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // Esperar a que los roles estén cargados
  await authService.rolesReady;

  const expectedRole = route.data?.['expectedRole'];
  const userRoles = authService.userRoles().map(r => r.nombre_rol);

  if (userRoles.includes(expectedRole)) {
    return true;
  }

  // Redirigir de forma inteligente si no tiene permisos pero está autenticado
  if (userRoles.includes('moderador')) {
    return router.createUrlTree(['/dashboard/moderator']);
  } else if (userRoles.includes('tutor')) {
    return router.createUrlTree(['/dashboard/tutor']);
  } else {
    return router.createUrlTree(['/dashboard']);
  }
};
