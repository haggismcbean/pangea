import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserService } from './user.service';
import { CharacterService } from './character.service';
import { AuthGuardService } from './auth-guard.service';

@NgModule({
    imports: [
    ],
    providers: [
        UserService,
        CharacterService,
        AuthGuardService,
    ],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ServicesModule { }
