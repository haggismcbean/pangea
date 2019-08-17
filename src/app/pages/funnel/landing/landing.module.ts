import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../components/components.module';
import { ActionsModule } from '../../../actions/actions.module';
import { LocationModule } from '../../../panels/location/location.module';
import { InventoryModule } from '../../../panels/inventory/inventory.module';
import { PlantsModule } from '../../../panels/plants/plants.module';
import { CraftingModule } from '../../../panels/crafting/crafting.module';

import { landingRouting } from './landing.routing';
import { LandingComponent } from './landing.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        landingRouting,
        // Child modules
        ActionsModule,
        LocationModule,
        PlantsModule,
        CraftingModule,
        InventoryModule
    ],
    providers: [
    ],
    declarations: [
        LandingComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LandingModule { }
