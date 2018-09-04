import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PangeaComponent } from './pangea.component';

const pangeaRoutes: Routes = [{
    path: 'pangea',
    component: PangeaComponent,
}];

export const pangeaRouting: ModuleWithProviders = RouterModule.forChild(pangeaRoutes);
