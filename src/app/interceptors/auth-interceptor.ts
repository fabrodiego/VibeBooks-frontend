import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  let token : string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('vibebooks_token');
  }

  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) {
          if (isPlatformBrowser(platformId)) {
            authService.logout();
            console.error('Token inválido ou expirado. Redirecionando para login.');
          }
        }
        return throwError(() => err);
      })
    );
  }
  return next(req);
};
