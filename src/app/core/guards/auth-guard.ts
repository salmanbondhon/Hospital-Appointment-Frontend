import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('======================');
  console.log('AUTH GUARD EXECUTED');

  if (authService.isLoggedIn()) {
    console.log('Access Granted');
    return true;
  }

  console.log('Access Denied');

  return router.createUrlTree(['/']);
};