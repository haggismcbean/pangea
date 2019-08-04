import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import { Message } from '../models/message.model';

@Injectable()
export class WebSocketService {
    public zoneUsersStream = new BehaviorSubject();
    private mainFeedStream;

    public addFeedStream(feedStream): void {
        this.mainFeedStream = feedStream;
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

        echo.private(channelId)
            .listen('MessageSent', (e) => {
                console.log('web socket message received!', e);

                if (this.mainFeedStream) {
                    const message = new Message(0);
                    message.setText(e.message.message);

                    this.mainFeedStream
                        .next(message);
                }
            });
    }

    public connectPresence(token, channelId): void {
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

        echo.join(channelId)
            .listen('MessageSent', (e) => {
                console.log('web socket message received!', e);

                if (this.mainFeedStream) {
                    const message = new Message(0);
                    message.setText(e.message.message);

                    this.mainFeedStream
                        .next(message);
                }
            })
            .here((users) => {
                console.log('here: ', users);
                this.zoneUsers = users;
                this.zoneUsersStream.next(this.zoneUsers);
            })
            .joining((user) => {
                console.log('joining: ', user);
                _.remove(zoneUsers, user.id);
                this.zoneUsersStream.next(this.zoneUsers);
            })
            .leaving((user) => {
                console.log('leaving: ', user);
                zoneUsers.push(user);
                this.zoneUsersStream.next(this.zoneUsers);
            });
    }
}
