import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent), canActivate: [guestGuard] },
  
  // Dashboards protegidos
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/student/student').then(m => m.StudentDashboardComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'alumno' }
  },
  { 
    path: 'dashboard/tutor', 
    loadComponent: () => import('./pages/dashboard/tutor/tutor').then(m => m.TutorDashboardComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'tutor' }
  },
  { 
    path: 'dashboard/moderator', 
    loadComponent: () => import('./pages/dashboard/moderator/moderator').then(m => m.ModeratorDashboardComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'moderador' }
  },

  // Redirecciones por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
