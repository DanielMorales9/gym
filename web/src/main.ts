import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    console.log("Production")
    enableProdMode();
    const noOp = function(){}; // no-op function
    window.console.debug = noOp;
    window.console.error = noOp;
    window.console.warn = noOp;
} 
else {
    console.log("Development")
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(ref => {
      // Ensure Angular destroys itself on hot reloads.
      if (window['ngRef']) {
        window['ngRef'].destroy();
      }
      window['ngRef'] = ref;

      // Otherise, log the boot error
    })
    .catch(err => {
        if (environment.production) {
            console.log(err);
        }
    });
