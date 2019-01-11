import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputModule } from './input/input.module';
import { FeedComponent } from './feed/feed.component';

const components = [
    FeedComponent,
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        InputModule,
    ],
    declarations: [
        ...components,
    ],
    exports: [
        ...components,
        InputModule,
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule { }
