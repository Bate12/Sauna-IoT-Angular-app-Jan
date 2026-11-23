import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { DataStorage } from './app/data/data-storage';
import { PreferencesDataStorage } from './app/data/preferences-data-storage';
import { SaunaRepository } from './app/data/sauna.repository';
import { LocalSaunaRepository } from './app/data/local-sauna.repository';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),

    // Datová vrstva – jediné místo, kde se volí implementace.
    { provide: DataStorage, useClass: PreferencesDataStorage },
    { provide: SaunaRepository, useClass: LocalSaunaRepository }, // v2: HttpSaunaRepository
  ],
});
