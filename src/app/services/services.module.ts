import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserService } from './user.service';
import { CharacterService } from './character.service';

@NgModule({
    imports: [
    ],
    providers: [
        UserService,
        CharacterService,
    ],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ServicesModule { }
