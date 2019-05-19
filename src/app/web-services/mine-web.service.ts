import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class MineWebService {
    constructor(
        private api: ApiService
    ) {}

    public createMine() {
        const url = `mine/create`;

        return this.api
            .post(url);
    }

    public mineMine(item) {
        const url = `mine/mine`;

        return this.api
            .post(url, {
                itemId: item.itemId,
                itemType: item.itemType,
            });
    }

    public reinforceMine() {
        const url = `mine/reinforce`;

        return this.api
            .post(url);
    }

    public getAccessibleStones() {
        const url = `mine/stones`;

        return this.api
            .get(url);
    }
}
