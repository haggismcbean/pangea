import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FeedComponent } from './feed/feed.component';
import { InputComponent } from './input/input.component';

const components = [
    FeedComponent,
    InputComponent,
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
    ],
    declarations: [
        ...components,
    ],
    exports: [
        ...components,
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule { }
