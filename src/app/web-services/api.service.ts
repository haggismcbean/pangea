import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Injectable()
export class ApiService {
    private readonly baseUrl = 'http://local.pangea-api.com:8888/api';

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {}

    public get(url, data?) {
        url = `${this.baseUrl}/${url}` + this.getApiToken(url);

        if (!data) {
            data = {};
        }

        return this.http
            .get<any>(url, data);
    }

    public post(url, data?) {
        url = `${this.baseUrl}/${url}` + this.getApiToken(url);

        if (!data) {
            data = {};
        }

        return this.http
            .post<any>(url, data);
    }

    public put(url, data?) {
        url = `${this.baseUrl}/${url}` + this.getApiToken(url);

        if (!data) {
            data = {};
        }

        return this.http
            .put<any>(url, data);
    }

    private getApiToken(url) {
        const user = this.userService.getUser();

        if (user) {
            if (url.indexOf('?') === -1) {
                return `?api_token=${user.token}`;
            } else {
                return `&api_token=${user.token}`;
            }
        }

        return '';
    }
}
