import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../components/components.module';
import { ActionsModule } from '../../../actions/actions.module';
import { PlantsModule } from '../../../panels/plants/plants.module';

import { landingRouting } from './landing.routing';
import { LandingComponent } from './landing.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        ActionsModule,
        landingRouting,
        PlantsModule
    ],
    providers: [
    ],
    declarations: [
        LandingComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LandingModule { }
