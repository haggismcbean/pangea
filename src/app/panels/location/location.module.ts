import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// import { ComponentsModule } from '../../../components/components.module';
// import { ActionsModule } from '../../../actions/actions.module';

import { LocationComponent } from './location.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    providers: [
    ],
    declarations: [
        LocationComponent
    ],
    exports: [
        LocationComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LocationModule { }
