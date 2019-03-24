import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class PlantWebService {
    constructor(
        private api: ApiService
    ) {}

    public gather(plant: any) {
        const url = `gather`;

        return this.api
            .put(url, {
                plantId: plant.plantId,
                plantPiece: plant.plantPiece
            });
    }
}
