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

    public getDescription(zoneId: number): any {
        const url = `zone/${zoneId}`;

        return this.api
            .get(url);
    }

    public getWakeUpText(zoneId: number): any {
        const url = `zone/${zoneId}/wake_up_text`;

        return this.api
            .get(url);
    }

    // TODO - Move into crafting
    public pickUp(itemId: number, amount: number): any {
        const url = `zone/pick_up`;

        return this.api
            .put(url, {
                itemId: itemId,
                itemQuantity: amount
            });
    }

    // TODO - Move into crafting
    public getActivities(zoneId: number) {
        const url = `zone/${zoneId}/activities`;

        return this.api
            .get(url);
    }

    // TODO - Move somewhere as well?
    public explore(zoneId: number) {
        const url = `zone/explore`;

        return this.api
            .post(url);
    }

    public name(zoneId: number, name: string): any {
        const url = `zone/name`;

        return this.api
            .post(url, {
                zoneId: zoneId,
                name: name
            });
    }
}
