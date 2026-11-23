import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'ovladani',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'historie',
        loadComponent: () =>
          import('./historie/historie.page').then((m) => m.HistoriePage),
      },
      {
        path: '',
        redirectTo: 'ovladani',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/ovladani',
    pathMatch: 'full',
  },
];
