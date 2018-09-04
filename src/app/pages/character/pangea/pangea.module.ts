import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { pangeaRouting } from './pangea.routing';
import { PangeaComponent } from './pangea.component';

@NgModule({
    imports: [
        FormsModule,
        pangeaRouting
    ],
    providers: [
    ],
    declarations: [
        PangeaComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class PangeaModule { }
