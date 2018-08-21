import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { landingRouting } from "./landing.routing";
import { LandingComponent } from "./landing.component";

@NgModule({
    imports: [
        landingRouting,
    ],
    providers: [
    ],
    declarations: [
        LandingComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LandingModule { }
