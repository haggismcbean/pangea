import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { Zone } from '../models/character.model';
import { ZoneWebService } from '../web-services/zone-web.service';

import * as _ from 'lodash';

@Injectable()
export class ZoneService {
    constructor(
        private zoneWebService: ZoneWebService
    ) {}

    public getBorderingZones(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getBorderingZones(zoneId);
    }

    public changeZones(zoneId: number): Observable<any> {
        return this.zoneWebService
            .changeZones(zoneId);
    }

    public getZoneCharacters(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getZoneCharacters(zoneId);
    }
}
