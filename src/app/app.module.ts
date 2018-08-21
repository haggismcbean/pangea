import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { LandingComponent } from './pages/funnel/landing/landing.component';

import { SignUpModule } from "./pages/funnel/sign-up/sign-up.module";
import { LandingModule } from "./pages/funnel/landing/landing.module";

const appRoutes: Routes = [
  { path: '',   redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', component: LandingComponent },
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SignUpModule,
        LandingModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        ),
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
