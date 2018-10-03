import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { embarkRouting } from './embark.routing';
import { EmbarkComponent } from './embark.component';

@NgModule({
    imports: [
        FormsModule,
        embarkRouting
    ],
    providers: [
    ],
    declarations: [
        EmbarkComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class EmbarkModule { }
