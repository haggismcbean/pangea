import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmbarkComponent } from './embark.component';

const embarkRoutes: Routes = [{
    path: 'embark',
    component: EmbarkComponent,
}];

export const embarkRouting: ModuleWithProviders = RouterModule.forChild(embarkRoutes);
