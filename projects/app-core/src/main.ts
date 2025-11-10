import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreAppModule } from './app/app-core.module';

platformBrowserDynamic()
  .bootstrapModule(CoreAppModule)
  .catch((err) => console.error(err));
