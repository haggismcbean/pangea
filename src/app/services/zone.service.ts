import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';

// import { Zone } from '../models/character.model';
import { ZoneWebService } from '../web-services/zone-web.service';
import { CharacterService } from '../services/character.service';
import { UserService } from '../services/user.service';
import { WebSocketService } from '../services/web-socket.service';

import * as _ from 'lodash';

@Injectable()
export class ZoneService {
    constructor(
        private zoneWebService: ZoneWebService,
        private characterService: CharacterService,
        private userService: UserService,
        private webSocketService: WebSocketService
    ) {}

    public getBorderingZones(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getBorderingZones(zoneId);
    }

    public changeZones(zoneId: number): Observable<any> {
        const character = this.characterService.getCurrent();
        const token = this.userService.getUser().token;

        // whenever we change zones, we need to leave all the chat rooms we're part of
        this.webSocketService.leaveChannel(token, `zone.${character.zoneId}`);
        this.webSocketService.leaveChannel(token, `group.${character.groupId}`);

        return this.zoneWebService
            .changeZones(zoneId)
            .pipe(
                flatMap((newZone) => {
                    this.webSocketService.connectPresence(token, `zone.${zoneId}`);
                    return this.characterService
                        .getCharacters({
                            isCacheBust: true
                        });
                })
            );
    }

    public getZoneCharacters(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getZoneCharacters(zoneId);
    }

    public getZonePlants(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getZonePlants(zoneId);
    }

    public getZoneInventory(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getZoneInventory(zoneId);
    }

    public getWakeUpText(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getWakeUpText(zoneId);
    }

    public pickUp(itemId: number, amount: number): Observable<any> {
        return this.zoneWebService
            .pickUp(itemId, amount);
    }

    public getActivities(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getActivities(zoneId);
    }

    public explore(zoneId: number): Observable<any> {
        return this.zoneWebService
            .explore(zoneId);
    }

    public getDescription(zoneId: number): Observable<any> {
        return this.zoneWebService
            .getDescription(zoneId);
    }

    public name(zoneId: number, name: string): Observable<any> {
        return this.zoneWebService
            .name(zoneId, name);
    }
}
