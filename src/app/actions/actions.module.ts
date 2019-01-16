import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LandingManager } from './landing/landing.manager';
import { LoginManager } from './login/login.manager';

@NgModule({
    imports: [
    ],
    providers: [
        LandingManager,
        LoginManager
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ActionsModule { }
