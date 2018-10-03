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
        url = `${this.baseUrl}/${url}` + this.getApiToken();

        if (!data) {
            data = {};
        }

        return this.http
            .get<any>(url, data);
    }

    public post(url, data?) {
        url = `${this.baseUrl}/${url}` + this.getApiToken();

        if (!data) {
            data = {};
        }

        return this.http
            .post<any>(url, data);
    }

    private getApiToken() {
        const user = this.userService.getUser();

        if (user) {
            return `?api_token=${user.token}`;
        }

        return '';
    }
}
