import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LandingManager } from './landing/landing.manager';
import { RegisterManager } from './register/register.manager';
import { LoginManager } from './login/login.manager';
import { CharacterCreationManager } from './character-creation/character-creation.manager';
import { LocationManager } from './location/location.manager';
import { MovementManager } from './movement/movement.manager';
import { LabourManager } from './labour/labour.manager';

import { ForagingManager } from './labour/foraging/foraging.manager';
import { HuntingManager } from './labour/hunting/hunting.manager';
import { FarmingManager } from './labour/farming/farming.manager';
import { MiningManager } from './labour/mining/mining.manager';
import { CraftingManager } from './labour/crafting/crafting.manager';
import { AddToActivityManager } from './labour/add-to-activity/add-to-activity.manager';
import { WorkOnActivityManager } from './labour/work-on-activity/work-on-activity.manager';
import { ExploringManager } from './labour/exploring/exploring.manager';

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
        ForagingManager,
        HuntingManager,
        FarmingManager,
        MiningManager,
        CraftingManager,
        AddToActivityManager,
        WorkOnActivityManager,
        ExploringManager
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ActionsModule { }
