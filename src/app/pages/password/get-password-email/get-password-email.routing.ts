import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetPasswordEmailComponent } from './get-password-email.component';

const getPasswordEmailRoutes: Routes = [{
    path: 'get-password-email',
    component: GetPasswordEmailComponent,
}];

export const getPasswordEmailRouting: ModuleWithProviders = RouterModule.forChild(getPasswordEmailRoutes);
