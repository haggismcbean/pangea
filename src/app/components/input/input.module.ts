import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputComponent } from './input.component';
import { InputService } from './services/input.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        InputService,
    ],
    declarations: [
        InputComponent,
    ],
    exports: [
        InputComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class InputModule { }
