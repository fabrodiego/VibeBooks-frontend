import {inject, PLATFORM_ID} from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('vibebooks_token');
    if (token) {
      return true;
    }
  }

  router.navigate(['/login']).catch(err => console.error('Redirect to login failed', err));
  return false;
};
