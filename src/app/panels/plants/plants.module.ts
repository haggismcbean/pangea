import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// import { ComponentsModule } from '../../../components/components.module';
// import { ActionsModule } from '../../../actions/actions.module';

import { PlantsComponent } from './plants.component';

@NgModule({
    imports: [
    ],
    providers: [
    ],
    declarations: [
        PlantsComponent
    ],
    exports: [
        PlantsComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class PlantsModule { }
