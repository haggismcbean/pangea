import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';

import { AuthenticationWebService } from "./authentication-web.service";

@NgModule({
	imports: [
		HttpClientModule
	],
	providers: [
		AuthenticationWebService
	],
    declarations: [
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WebServicesModule { }
