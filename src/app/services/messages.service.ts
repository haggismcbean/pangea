import { Injectable } from '@angular/core';

import { MessagesWebService } from '../web-services/messages-web.service';

@Injectable()
export class MessagesService {
    constructor(
        private messagesWebService: MessagesWebService
    ) {}

    public sendMessage(message, sourceCharacter) {
        return this.messagesWebService
            .sendMessage(message, sourceCharacter);
    }

    public sendCharacterMessage(message, sourceCharacter, targetCharacter) {
        return this.messagesWebService
            .sendCharacterMessage(message, sourceCharacter, targetCharacter);
    }
}
