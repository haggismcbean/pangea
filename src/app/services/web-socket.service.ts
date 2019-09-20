import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import * as _ from 'lodash';

import { Message } from '../models/message.model';
import { CharacterService } from './character.service';
import { UserService } from './user.service';
import { ZoneWebService } from '../web-services/zone-web.service';

@Injectable()
export class WebSocketService {
    private zoneUsers = [];
    public zoneUsersStream = new BehaviorSubject(this.zoneUsers);

    private mainFeedStream;
    private groupChannel;

    constructor (
        private characterService: CharacterService,
        private userService: UserService,
        private zoneWebService: ZoneWebService
    ) {}

    public addFeedStream(feedStream): void {
        this.mainFeedStream = feedStream;
    }

    public leaveChannel(token, channelId): void {
        if (this.groupChannel) {
            this.groupChannel.leave(channelId);
        }
    }

    public connect(token, channelId): void {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://api.pangeana.com:6001',
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
                console.log('message', e);
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
                console.log('message', e);
                this.handleMessage(e.message);
            })
            .here((characters) => {
                console.log('here', characters);
                this.zoneUsers = characters;
                this.zoneUsersStream.next(this.zoneUsers);
            })
            .joining((character) => {
                console.log('joining', character);
                this.handleCharacterJoining(character);
            })
            .leaving((character) => {
                console.log('leaving', character);
                this.handleCharacterLeaving(character);
            });

        if (channelId.indexOf('group') > -1) {
            this.groupChannel = echo;
        }

    }

    private handleMessage(_message) {
        if (this.mainFeedStream) {
            const message = new Message(0);
            message.setSource({
                id: _message.source_id,
                name: _message.source_name
            });
            message.setDate(_message.created_at);
            message.setText(_message.message);
            const character = this.characterService.getCurrent();

            // If the message is a user leaving, we can opt to follow the user
            if (_message.change === 'zone' && _message.source_id !== character.id) {
                message.setAction({
                    text: 'follow',
                    callback: () => {
                        const targetZone = _message.change_id;
                        this.zoneWebService
                            .changeZones(targetZone)
                            .subscribe();
                    }
                });
            }

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
            this.connectPresence(token, `group.${message.change_id}`);
        }
    }

    private handleCharacterJoining(character) {
        this.zoneUsers.push(character);
        this.zoneUsersStream.next(this.zoneUsers);

        // send joining message
        this.characterService
            .getCharacters({
                isCacheBust: true
            })
            .subscribe(() => {
                this.characterService
                    .getLastMessage(character.id)
                    .subscribe((lastMessage) => {
                        if (lastMessage.change === 'zone') {
                            // hopefully we'll get an arrival message from the backend
                        } else {
                            const message = new Message(0);
                            message.setText(`${character.name} has woken up`);

                            this.mainFeedStream
                                .next(message);
                        }
                    });
            });
    }

    private handleCharacterLeaving(character) {
        _.remove(this.zoneUsers, character.id);
        this.zoneUsersStream.next(this.zoneUsers);

        // send leaving message
        this.characterService
            .getCharacters({
                isCacheBust: true
            })
            .subscribe(() => {
                this.characterService
                    .getLastMessage(character.id)
                    .subscribe((lastMessage) => {
                        if (lastMessage.change === 'zone' && lastMessage.change_id !== character.zoneId) {
                            // hopefully we'll get a leave message from the backend
                        } else {
                            const message = new Message(0);
                            message.setText(`${character.name} has fallen asleep`);

                            this.mainFeedStream
                                .next(message);
                        }
                    });
            });
    }
}
