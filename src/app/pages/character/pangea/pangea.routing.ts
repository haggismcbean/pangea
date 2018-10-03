import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PangeaComponent } from './pangea.component';
import { AuthGuardService } from '../../../services/auth-guard.service';

const pangeaRoutes: Routes = [{
    path: 'pangea',
    component: PangeaComponent,
    canActivate: [AuthGuardService],
}];

export const pangeaRouting: ModuleWithProviders = RouterModule.forChild(pangeaRoutes);
