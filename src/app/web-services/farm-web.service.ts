import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class FarmWebService {
    constructor(
        private api: ApiService
    ) {}

    public createPlot(itemId: number) {
        const url = `farm/create`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public ploughPlot(itemId: number) {
        const url = `farm/plough`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public plantPlot(itemId: number) {
        const url = `farm/plant`;

        return this.api
            .post(url, {
                plantId: itemId
            });
    }

    public tillPlot(itemId: number) {
        const url = `farm/till`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public fertilizePlot(itemId: number) {
        const url = `farm/fertilize`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public harvestPlot(itemId: number) {
        const url = `farm/harvest`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }
}
