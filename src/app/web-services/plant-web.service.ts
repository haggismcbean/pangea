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
        const url = `plant/gather`;

        return this.api
            .put(url, {
                plantId: plant.plantId,
                plantPiece: plant.plantPiece,
                amount: plant.amount
            });
    }

    public name(plant: any, newName: string) {
        const url = `plant/name`;

        return this.api
            .post(url, {
                plantId: plant.id,
                name: newName
            });
    }

    public share(plant: any, character: any) {
        const url = `plant/share`;

        return this.api
            .post(url, {
                plantId: plant.id,
                characterId: character.id
            });
    }
}
