import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Injectable()
export class WebhookService {
    private baseUrl = 'http://local.pangea-api.com:8888/api';

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {}

    public fetchMessages(token) {
        const url = `${this.baseUrl}/messages?api_token=${token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .get<any>(url);
    }

    public addMessage(message) {
        const user = this.userService.getUser();
        const url = `${this.baseUrl}/messages?api_token=${user.token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, message);
    }
}
