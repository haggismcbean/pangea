import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LandingComponent } from './pages/funnel/landing/landing.component';

import { SignUpModule } from './pages/funnel/sign-up/sign-up.module';
import { SignInModule } from './pages/funnel/sign-in/sign-in.module';
import { LandingModule } from './pages/funnel/landing/landing.module';
import { GetPasswordEmailModule } from './pages/password/get-password-email/get-password-email.module';
import { ResetPasswordModule } from './pages/password/reset-password/reset-password.module';
import { PangeaModule } from './pages/character/pangea/pangea.module';
import { EmbarkModule } from './pages/character/embark/embark.module';

import { WebServicesModule } from './web-services/web-services.module';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', component: LandingComponent },
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        // 3rd Party
        BrowserModule,
        RouterModule.forRoot(
            appRoutes
        ),
        NoopAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        // Not 3rd Party
        SignUpModule,
        SignInModule,
        LandingModule,
        GetPasswordEmailModule,
        ResetPasswordModule,
        PangeaModule,
        EmbarkModule,
        WebServicesModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
