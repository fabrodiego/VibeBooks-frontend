import { inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { of, map, catchError } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.currentUser()) {
    return true;
  }

  if (!authService.isTokenValid()) {
    authService.logout();
    return false;
  }

  return userService.getMe().pipe(
    map((user) => {
      authService.currentUser.set(user);
      authService.isLoggedIn.set(true);
      return true;
    }),
    catchError(() => {
      authService.logout();
      return of(false);
    })
  );
};
