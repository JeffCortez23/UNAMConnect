import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent), canActivate: [guestGuard], title: 'Iniciar Sesión — UNAMConnect' },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent), canActivate: [guestGuard], title: 'Registro — UNAMConnect' },
  
  // Dashboards protegidos
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/student/student').then(m => m.StudentDashboardComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'alumno' },
    title: 'Panel Alumno — UNAMConnect'
  },
  { 
    path: 'dashboard/tutor', 
    loadComponent: () => import('./pages/dashboard/tutor/tutor').then(m => m.TutorDashboardComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'tutor' },
    title: 'Panel Tutor — UNAMConnect'
  },
  { 
    path: 'dashboard/moderator', 
    loadComponent: () => import('./pages/dashboard/moderator/moderator').then(m => m.ModeratorDashboardComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'moderador' },
    title: 'Panel Moderador — UNAMConnect'
  },

  // Redirecciones por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
