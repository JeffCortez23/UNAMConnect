import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.error && typeof error.error === 'object') {
          errorMessage = error.error.error || error.error.message || errorMessage;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else {
          errorMessage = `Error del servidor (${error.status}): ${error.statusText}`;
        }
      }

      // Mostrar el error normalizado mediante el servicio de notificaciones
      notificationService.showToast(errorMessage, 'error');

      return throwError(() => new Error(errorMessage));
    })
  );
};
