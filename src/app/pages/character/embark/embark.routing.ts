import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmbarkComponent } from './embark.component';
import { AuthGuardService } from '../../../services/auth-guard.service';

const embarkRoutes: Routes = [{
    path: 'embark',
    component: EmbarkComponent,
    canActivate: [AuthGuardService],
}];

export const embarkRouting: ModuleWithProviders = RouterModule.forChild(embarkRoutes);
