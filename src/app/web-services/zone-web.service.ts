import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class ZoneWebService {
    constructor(
        private api: ApiService
    ) {}

    public getBorderingZones(zoneId: number) {
        const url = `zone/${zoneId}/borders`;

        return this.api
            .get(url);
    }

    public changeZones(newZoneId: number): any {
        const url = `zone/${newZoneId}/move`;

        return this.api
            .post(url, {});
    }

    public getZoneCharacters(zoneId: number): any {
        const url = `zone/${zoneId}/characters`;

        return this.api
            .get(url);
    }

    public getZonePlants(zoneId: number): any {
        const url = `zone/${zoneId}/plants`;

        return this.api
            .get(url);
    }

    public getZoneInventory(zoneId: number): any {
        const url = `zone/${zoneId}/inventory`;

        return this.api
            .get(url);
    }

    public getWakeUpText(zoneId: number): any {
        const url = `zone/${zoneId}`;

        return this.api
            .get(url);
    }

    public pickUp(itemId: number, amount: number): any {
        const url = `zone/pick_up`;

        return this.api
            .put(url, {
                itemId: itemId,
                itemQuantity: amount
            });
    }

    public getActivities(zoneId: number) {
        const url = `zone/${zoneId}/activities`;

        return this.api
            .get(url);
    }

    public explore(zoneId: number) {
        const url = `zone/explore`;

        return this.api
            .post(url);
    }
}
