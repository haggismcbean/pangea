import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getPasswordEmailRouting } from './get-password-email.routing';
import { GetPasswordEmailComponent } from './get-password-email.component';

@NgModule({
    imports: [
        FormsModule,
        getPasswordEmailRouting,
    ],
    providers: [
    ],
    declarations: [
        GetPasswordEmailComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class GetPasswordEmailModule { }
