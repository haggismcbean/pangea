import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LandingComponent } from './pages/funnel/landing/landing.component';

import { LandingModule } from './pages/funnel/landing/landing.module';

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
        LandingModule,
        WebServicesModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
