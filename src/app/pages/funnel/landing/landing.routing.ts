import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing.component';

const landingRoutes: Routes = [
    {
        path: 'landing',
        component: LandingComponent,
    }
];

export const landingRouting: ModuleWithProviders = RouterModule.forChild(landingRoutes);
