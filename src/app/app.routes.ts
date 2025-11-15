import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'simple', 
    loadComponent: () => import('./simple/simple').then(c => c.Simple) 
  },
  { 
    path: 'compuesta', 
    loadComponent: () => import('./compuesta/compuesta').then(c => c.Compuesta) 
  },
  { path: '', redirectTo: '/simple', pathMatch: 'full' }
];