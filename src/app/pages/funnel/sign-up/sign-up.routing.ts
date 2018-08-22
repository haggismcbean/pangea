import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

const signUpRoutes: Routes = [{
    path: 'sign-up',
    component: SignUpComponent,
}];

export const signUpRouting: ModuleWithProviders = RouterModule.forChild(signUpRoutes);
