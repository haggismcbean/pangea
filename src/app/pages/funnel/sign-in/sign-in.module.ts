import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { signInRouting } from './sign-in.routing';
import { SignInComponent } from './sign-in.component';

@NgModule({
    imports: [
        FormsModule,
        signInRouting,
    ],
    providers: [
    ],
    declarations: [
        SignInComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SignInModule { }
