import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

const resetPasswordRoutes: Routes = [{
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
}];

export const resetPasswordRouting: ModuleWithProviders = RouterModule.forChild(resetPasswordRoutes);
