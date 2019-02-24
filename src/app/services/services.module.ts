import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserService } from './user.service';
import { CharacterService } from './character.service';
import { AuthGuardService } from './auth-guard.service';
import { WebSocketService } from './web-socket.service';
import { ZoneService } from './zone.service';

@NgModule({
    imports: [
    ],
    providers: [
        UserService,
        CharacterService,
        AuthGuardService,
        WebSocketService,
        ZoneService
    ],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ServicesModule { }
