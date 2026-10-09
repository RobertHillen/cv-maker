import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    DatePipe,
    provideHttpClient(),
    provideOptimus({
      theme: {
        preset: Aura,
        options: { darkModeSelector: false }
      }
    })
  ]
};