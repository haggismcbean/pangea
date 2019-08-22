import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LandingManager } from './landing/landing.manager';
import { RegisterManager } from './register/register.manager';
import { LoginManager } from './login/login.manager';
import { CharacterCreationManager } from './character-creation/character-creation.manager';
import { LocationManager } from './location/location.manager';
import { MovementManager } from './movement/movement.manager';
import { LabourManager } from './labour/labour.manager';
import { SpeakingManager } from './speaking/speaking.manager';

import { HuntingManager } from './labour/hunting/hunting.manager';
import { FarmingManager } from './labour/farming/farming.manager';
import { MiningManager } from './labour/mining/mining.manager';
import { ExploringManager } from './labour/exploring/exploring.manager';

import { GroupSpeakManager } from './speaking/group-speak/group-speak.manager';
import { ZoneSpeakManager } from './speaking/zone-speak/zone-speak.manager';

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
        LabourManager,
        SpeakingManager,
        HuntingManager,
        FarmingManager,
        MiningManager,
        ExploringManager,
        GroupSpeakManager,
        ZoneSpeakManager
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ActionsModule { }
