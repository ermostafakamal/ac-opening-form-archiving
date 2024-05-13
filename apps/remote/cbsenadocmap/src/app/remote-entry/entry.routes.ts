import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';

import { ParentdashboardlandingComponent } from './Components/parentdashboardlanding/parentdashboardlanding.component';

export const remoteRoutes: Route[] = [
  { path: '', component: ParentdashboardlandingComponent },
  { path: 'home', component: RemoteEntryComponent },
  
];
