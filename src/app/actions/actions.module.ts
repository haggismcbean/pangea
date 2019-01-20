import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LandingManager } from './landing/landing.manager';
import { RegisterManager } from './register/register.manager';
import { LoginManager } from './login/login.manager';
import { CharacterCreationManager } from './character-creation/character-creation.manager';

@NgModule({
    imports: [
    ],
    providers: [
        LandingManager,
        RegisterManager,
        LoginManager,
        CharacterCreationManager
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ActionsModule { }
