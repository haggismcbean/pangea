import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserService } from './user.service';
import { CharacterService } from './character.service';
import { FarmService } from './farm.service';
import { AuthGuardService } from './auth-guard.service';
import { WebSocketService } from './web-socket.service';
import { ZoneService } from './zone.service';
import { PlantService } from './plant.service';
import { MineService } from './mine.service';

@NgModule({
    imports: [
    ],
    providers: [
        UserService,
        CharacterService,
        FarmService,
        AuthGuardService,
        WebSocketService,
        ZoneService,
        PlantService,
        MineService
    ],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ServicesModule { }
