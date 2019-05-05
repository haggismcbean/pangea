import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { Character } from '../models/character.model';
import { FarmWebService } from '../web-services/farm-web.service';

import * as _ from 'lodash';

@Injectable()
export class FarmService {
    constructor(
        private farmWebService: FarmWebService
    ) {}

    public createPlot(itemId): Observable<any> {
        return this.farmWebService
            .createPlot(itemId);
    }

    public ploughPlot(itemId): Observable<any> {
        return this.farmWebService
            .ploughPlot(itemId);
    }

    public plantPlot(itemId): Observable<any> {
        return this.farmWebService
            .plantPlot(itemId);
    }

    public tillPlot(itemId): Observable<any> {
        return this.farmWebService
            .tillPlot(itemId);
    }

    public fertilizePlot(itemId): Observable<any> {
        return this.farmWebService
            .fertilizePlot(itemId);
    }

    public harvestPlot(itemId): Observable<any> {
        return this.farmWebService
            .harvestPlot(itemId);
    }
}
