import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import { WebhookService } from '../../../web-services/webhook.service';
import { UserService } from '../../../services/user.service';
import { CharacterService } from '../../../services/character.service';
import { User } from '../../../models/user.model';
import { Character } from '../../../models/character.model';

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

    public user: User;
    public character: Character;

    public message = {
        message: '',
        characterId: 0
    };

    public newMessage = '';

    public messages = [];

    constructor(
        private router: Router,
        private webhookService: WebhookService,
        private http: HttpClient,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private characterService: CharacterService
    ) {
        this.activatedRoute.queryParams
            .subscribe((queryParams) => {
                this.character = this.characterService.getCharacter(Number(queryParams.characterId));
                this.user = this.userService.getUser();

                const echo = new Echo({
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

                echo.private('chat.' + this.character.id)
                    .listen('MessageSent', (e) => {
                        console.log('message!', e);
                        this.messages.push({
                            message: e.message.message,
                            user: e.user
                        });
                    });
            });
    }

    public sendMessage() {
        this.message.message = this.newMessage;
        this.message.characterId = this.character.id;

        this.webhookService
            .addMessage(this.message)
            .subscribe((response) => {
                console.log('response? ??', response);
            });
    }
}
