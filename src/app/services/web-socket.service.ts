import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import * as _ from 'lodash';

import { Message } from '../models/message.model';
import { CharacterService } from './character.service';
import { UserService } from './user.service';

@Injectable()
export class WebSocketService {
    private zoneUsers = [];
    public zoneUsersStream = new BehaviorSubject(this.zoneUsers);

    private mainFeedStream;

    constructor (
        private characterService: CharacterService,
        private userService: UserService
    ) {}

    public addFeedStream(feedStream): void {
        this.mainFeedStream = feedStream;
    }

    public leaveChannel(token, channelId): void {
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

        echo.leave(channelId);
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
                this.handleMessage(e.message);
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
                console.log('web socket presence message received!', e);
                this.handleMessage(e.message);
            })
            .here((users) => {
                console.log('here: ', users);
                this.zoneUsers = users;
                this.zoneUsersStream.next(this.zoneUsers);
            })
            .joining((user) => {
                console.log('joining: ', user);
                _.remove(this.zoneUsers, user.id);
                this.zoneUsersStream.next(this.zoneUsers);
            })
            .leaving((user) => {
                console.log('leaving: ', user);
                this.zoneUsers.push(user);
                this.zoneUsersStream.next(this.zoneUsers);
            });
    }

    private handleMessage(_message) {
        if (this.mainFeedStream) {
            const message = new Message(0);
            message.setText(_message.message);

            this.mainFeedStream
                .next(message);
        }

        if (_message.change) {
            this.refreshSubscription(_message);
        }
    }

    private refreshSubscription(message) {
        const token = this.userService.getUser().token;
        const character = this.characterService.getCurrent();

        if (message.change === 'zone') {
            this.leaveChannel(token, `zone.{character.zoneId}`);
            if (character.groupId) {
                this.leaveChannel(token, `group.{character.groupId}`);
            }

            this.characterService
                .getCharacters({
                    isCacheBust: true
                })
                .subscribe(() => {
                    const resetMessage = new Message(0);
                    resetMessage.class = 'reset';

                    this.mainFeedStream
                        .next(resetMessage);
                });
        }

        if (message.change === 'group') {
            console.log('connecting presence:', `group.${message.change_id}`);
            this.connectPresence(token, `group.${message.change_id}`);
        }
    }
}
