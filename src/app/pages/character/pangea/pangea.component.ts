import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import { WebhookService } from '../../../web-services/webhook.service';


@Component({
    selector: 'pan-gea',
    templateUrl: './pangea.component.html',
    styleUrls: ['../../../app.component.css']
})
export class PangeaComponent {
    public form = {
        email: '',
        password: '',
    };

    public user = {
        api_token: '',
        name: 'Harry',
        email: '',
        id: 0
    };

    public message = {
        message: '',
        user: this.user
    };

    public newMessage = '';

    public messages = [];

    constructor(
        private router: Router,
        private webhookService: WebhookService,
        private http: HttpClient
    ) {
         const echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://local.pangea-api.com:6001',
            auth:
            {
                headers:
                {
                    'Authorization': 'Bearer ' + undefined
                },
            },
            client: io
        });

        echo.private('chat')
            .listen('MessageSent', (e) => {
                console.log('UNAUTHENTICATED private!', e);
                this.messages.push({
                    message: e.message.message,
                    user: e.user
                });
            });
    }

    public sendMessage() {
        console.log('send!!');
        this.message.message = this.newMessage;
        this.webhookService
            .addMessage(this.message)
            .subscribe((response) => {
                console.log('response? ??', response);
            });
    }
}
