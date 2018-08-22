import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from './sign-in.component';

const signInRoutes: Routes = [{
    path: 'sign-in',
    component: SignInComponent,
}];

export const signInRouting: ModuleWithProviders = RouterModule.forChild(signInRoutes);
