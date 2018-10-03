import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { BackendService } from '~/shared/services/backend.service';
import { UserService } from '../services/user.service';

@Injectable()
export class CharacterWebService {
    private baseUrl = 'http://local.pangea-api.com:8888/api';

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {}

    public create() {
        const user = this.userService.getUser();
        const url = `${this.baseUrl}/character?api_token=${user.token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, {});
    }

    public get(): any {
        const user = this.userService.getUser();
        const url = `${this.baseUrl}/characters?api_token=${user.token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .get<any>(url);
    }
}
