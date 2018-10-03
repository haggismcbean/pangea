import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { pangeaRouting } from './pangea.routing';
import { PangeaComponent } from './pangea.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
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
