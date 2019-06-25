import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// import { ComponentsModule } from '../../../components/components.module';
// import { ActionsModule } from '../../../actions/actions.module';

import { LocationComponent } from './location.component';

@NgModule({
    imports: [
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
