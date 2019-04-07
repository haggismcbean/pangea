import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {

    constructor(
    ) {
    }

    public connect(token, channelId): void {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://local.pangea-api.com:6001',
            auth:
            {
                headers:
                {
                    'Authorization': 'Bearer ' + token
                },
            },
            client: io
        });

         echo.private('chat.' + channelId)
            .listen('MessageSent', (e) => {
                console.log('web socket message received!', e);
                // this.messages.push({
                //     message: e.message.message,
                //     user: e.user
                // });
            });
    }
}
