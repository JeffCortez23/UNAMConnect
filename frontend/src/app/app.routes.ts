import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
  
  // Dashboards protegidos
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/student/student').then(m => m.StudentDashboardComponent), canActivate: [authGuard] },
  { path: 'dashboard/tutor', loadComponent: () => import('./pages/dashboard/tutor/tutor').then(m => m.TutorDashboardComponent), canActivate: [authGuard] },
  { path: 'dashboard/moderator', loadComponent: () => import('./pages/dashboard/moderator/moderator').then(m => m.ModeratorDashboardComponent), canActivate: [authGuard] },

  // Redirecciones por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
