import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { BackendService } from '~/shared/services/backend.service';

@Injectable()
export class WebhookService {
    private baseUrl = 'http://local.pangea-api.com:8888/api';

    constructor(
        private http: HttpClient,
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
        const url = `${this.baseUrl}/messages?api_token=${message.user.api_token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, message);
    }
}
