import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { resetPasswordRouting } from './reset-password.routing';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
    imports: [
        FormsModule,
        resetPasswordRouting,
    ],
    providers: [
    ],
    declarations: [
        ResetPasswordComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ResetPasswordModule {}
