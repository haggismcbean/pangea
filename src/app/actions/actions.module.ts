import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LandingManager } from './landing/landing.manager';
import { RegisterManager } from './register/register.manager';
import { LoginManager } from './login/login.manager';
import { CharacterCreationManager } from './character-creation/character-creation.manager';
import { LocationManager } from './location/location.manager';
import { MovementManager } from './movement/movement.manager';
import { LabourManager } from './labour/labour.manager';

@NgModule({
    imports: [
    ],
    providers: [
        LandingManager,
        RegisterManager,
        LoginManager,
        CharacterCreationManager,
        LocationManager,
        MovementManager,
        LabourManager
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ActionsModule { }
