import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
