import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth';

export const publicGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};
