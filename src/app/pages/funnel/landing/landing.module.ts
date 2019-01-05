import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { ComponentsModule } from '../../../components/components.module';

import { landingRouting } from './landing.routing';
import { LandingComponent } from './landing.component';

@NgModule({
    imports: [
    	ComponentsModule,
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
