import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class WebhookService {
    constructor(
        private api: ApiService
    ) {}

    public fetchMessages(token) {
        const url = `messages`;

        return this.api
            .get(url);
    }

    public addMessage(message) {
        const url = `messages`;

        return this.api
            .post(url, message);
    }
}
