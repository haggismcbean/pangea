import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginManager } from './login/login.manager';

@NgModule({
    imports: [
    ],
    providers: [
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
