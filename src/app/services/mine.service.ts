import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MineWebService } from '../web-services/mine-web.service';

import * as _ from 'lodash';

@Injectable()
export class MineService {
    constructor(
        private mineWebService: MineWebService
    ) {}

    public createMine(): Observable<any> {
        return this.mineWebService
            .createMine();
    }

    public mineMine(): Observable<any> {
        return this.mineWebService
            .mineMine();
    }

    public reinforceMine(): Observable<any> {
        return this.mineWebService
            .reinforceMine();
    }
}
