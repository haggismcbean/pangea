import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// import { ComponentsModule } from '../../../components/components.module';
// import { ActionsModule } from '../../../actions/actions.module';

import { LocationComponent } from './location.component';
import { ActivitiesComponent } from './sub-panels/activities/activities.component';
import { ItemsComponent } from './sub-panels/items/items.component';
import { PeopleComponent } from './sub-panels/people/people.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    providers: [
    ],
    declarations: [
        LocationComponent,
        ActivitiesComponent,
        ItemsComponent,
        PeopleComponent
    ],
    exports: [
        LocationComponent,
        ActivitiesComponent,
        ItemsComponent,
        PeopleComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LocationModule { }
