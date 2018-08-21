import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from '@angular/forms'

import { signUpRouting } from "./sign-up.routing";
import { SignUpComponent } from "./sign-up.component";

@NgModule({
    imports: [
    	FormsModule,
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
