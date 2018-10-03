import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ServicesModule } from '../services/services.module';

import { AuthenticationWebService } from './authentication-web.service';
import { CharacterWebService } from './character-web.service';
import { WebhookService } from './webhook.service';

@NgModule({
    imports: [
        HttpClientModule,
        ServicesModule
    ],
    providers: [
        AuthenticationWebService,
        WebhookService,
        CharacterWebService,
    ],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WebServicesModule { }
