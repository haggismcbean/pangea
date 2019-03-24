import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ServicesModule } from '../services/services.module';

import { ApiService } from './api.service';
import { AuthenticationWebService } from './authentication-web.service';
import { CharacterWebService } from './character-web.service';
import { WebhookService } from './webhook.service';
import { ZoneWebService } from './zone-web.service';
import { PlantWebService } from './plant-web.service';

@NgModule({
    imports: [
        HttpClientModule,
        ServicesModule
    ],
    providers: [
        ApiService,
        AuthenticationWebService,
        WebhookService,
        CharacterWebService,
        ZoneWebService,
        PlantWebService
    ],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WebServicesModule { }
