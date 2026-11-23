import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'controls',
        loadComponent: () =>
          import('./controls/controls.page').then((m) => m.ControlsPage),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./historie/historie.page').then((m) => m.HistoriePage),
      },
      {
        path: 'info',
        loadComponent: () => import('./info/info.page').then((m) => m.InfoPage),
      },
      {
        path: '',
        redirectTo: 'controls',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/controls',
    pathMatch: 'full',
  },
];
