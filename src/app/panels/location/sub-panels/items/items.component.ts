import { Component, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { ZoneService } from '../../../../services/zone.service';
import { WebSocketService } from '../../../../services/web-socket.service';
import { MessagesService } from '../../../../services/messages.service';
import { CharacterService } from '../../../../services/character.service';

import { Prompt } from '../../../../actions/prompt.model';
import { Option } from '../../../../actions/option.model';

import { Message } from '../../../../models/message.model';
import { Character } from '../../../../models/character.model';

@Component({
    selector: 'pan-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
    @Input() public mainFeedStream;
    @Input() public promptStream;
    @Input() public optionsStream;

    @Input() public items;

    constructor(
        private zoneService: ZoneService,
        private webSocketService: WebSocketService,
        private messagesService: MessagesService,
        private characterService: CharacterService
    ) {}

    public collect(item) {
        const amountPrompt = new Prompt('How much of this resource do you want to pick up?');

        amountPrompt
            .answerStream
            .subscribe((amount) => {
                amount = Number(amount);

                if (amount < 1) {
                    return;
                }

                this.zoneService
                    .pickUp(item.id, amount)
                    .subscribe((response) => {
                        console.log('response', response);
                    });
            });

        this.promptStream.next(amountPrompt);
    }
}
