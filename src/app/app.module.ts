import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { LandingComponent } from './pages/funnel/landing/landing.component';
import { SignUpComponent } from "./pages/funnel/sign-up/sign-up.component";

// import { SignUpModule } from "./pages/funnel/sign-up/sign-up.module";

const appRoutes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '',   redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', component: SignUpComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        SignUpComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        ),
        // SignUpModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
