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
  {
    path: 'simulador',
    loadComponent: () => import('./simulador/simulador').then(m => m.Simulador)
  },

  { path: '', redirectTo: '/simple', pathMatch: 'full' }
];