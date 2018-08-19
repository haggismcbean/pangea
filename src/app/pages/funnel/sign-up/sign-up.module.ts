import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { signUpRouting } from "./sign-up.routing";
import { SignUpComponent } from "./sign-up.component";

@NgModule({
    imports: [
        signUpRouting,
    ],
    providers: [
    ],
    declarations: [
        SignUpComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SignUpModule { }
