import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PlantWebService } from '../web-services/plant-web.service';

@Injectable()
export class PlantService {

    constructor(
        private plantWebService: PlantWebService
    ) {}

    public gather(plant: any) {
        return this.plantWebService.gather(plant);
    }
}
