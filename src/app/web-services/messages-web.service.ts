import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class MessagesWebService {
    constructor(
        private api: ApiService
    ) {}

    public fetchMessages(characterId) {
        const url = `messages?character_id=${characterId}`;

        return this.api
            .get(url);
    }

    public sendMessage(message, sourceCharacter) {
        const url = `messages`;

        return this.api
            .post(url, {
                message,
                sourceId: sourceCharacter.id
            });
    }

    public sendCharacterMessage(message, sourceCharacter, targetCharacter) {
        const url = `character/messages`;

        return this.api
            .post(url, {
                message: message,
                sourceId: sourceCharacter.id,
                targetId: targetCharacter.id
            });
    }
}
