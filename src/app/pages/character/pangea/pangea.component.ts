import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import { WebhookService } from '../../../web-services/webhook.service';
import { UserService } from '../../../services/user.service';
import { CharacterService } from '../../../services/character.service';
import { ZoneService } from '../../../services/zone.service';

import { User } from '../../../models/user.model';
import { Character } from '../../../models/character.model';

@Component({
    selector: 'pan-gea',
    templateUrl: './pangea.component.html',
    styleUrls: ['../../../app.component.css', './pangea.component.scss']
})
export class PangeaComponent {
    public form = {
        email: '',
        password: '',
    };

    public user: User;
    public character: Character;

    public message = {
        message: '',
        characterId: 0
    };

    public newMessage = '';
    public messages = [];

    private echoSocket;

    constructor(
        private router: Router,
        private webhookService: WebhookService,
        private http: HttpClient,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private characterService: CharacterService,
        private zoneService: ZoneService
    ) {
        this.activatedRoute.queryParams
            .pipe(
                flatMap((queryParams) => {
                    const characterId = Number(queryParams.characterId);
                    return combineLatest(
                        this.webhookService.fetchMessages(characterId),
                        this.characterService.getCharacter(characterId),
                    );
                })
            )
            .subscribe((subscriptions: any) => {
                this.messages = subscriptions[0].data;
                this.character = subscriptions[1];
                this.user = this.userService.getUser();

                console.log('messages: ', this.messages);
                console.log('character: ', this.character);

                this.registerEchoSocket();
                this.subscribeCharacter();
                // todo: get the actual zoneId
                this.getZoneCharacters(1);
            });
    }

    public sendMessage() {
        this.message.message = this.newMessage;
        this.message.characterId = this.character.id;

        return this.webhookService
            .addMessage(this.message)
            .subscribe();
    }

    private registerEchoSocket(): void {
        this.echoSocket = new Echo({
            broadcaster: 'socket.io',
            host: 'http://local.pangea-api.com:6001',
            auth:
            {
                headers: {
                    'Authorization': 'Bearer ' + this.user.token
                },
            },
            client: io
        });
    }

    private subscribeCharacter(): void {
        this.echoSocket
            .private('chat.' + this.character.id)
            .listen('MessageSent', (e) => {
                console.log('message!', e);
                this.messages.push({
                    message: e.message.message,
                    user: e.user
                });
            });
    }

    private getZoneCharacters(zoneId): void {
        this.zoneService
            .getZoneCharacters(zoneId)
            .subscribe((characters: any) => {
                console.log('characters: ', characters);
            });
    }
}
