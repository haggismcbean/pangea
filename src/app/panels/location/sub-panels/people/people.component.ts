import { Component, OnInit, Input } from '@angular/core';

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
    selector: 'pan-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
    @Input() public mainFeedStream;
    @Input() public promptStream;
    @Input() public optionsStream;

    @Input() public people;
    @Input() public asleepPeopleCount;

    public character: Character;

    public isShowingSleepers = false;

    constructor(
        private zoneService: ZoneService,
        private webSocketService: WebSocketService,
        private messagesService: MessagesService,
        private characterService: CharacterService
    ) {}

    ngOnInit() {
        this.character = this.characterService.getCurrent();
    }

    public talk($event, targetCharacter) {
        const speechPrompt = new Prompt(`To ${targetCharacter.name}`);

        speechPrompt
            .answerStream
            .subscribe((message) => {
                this.messagesService
                    .sendCharacterMessage(message, this.character, targetCharacter)
                    .subscribe((response) => {
                        console.log('resposne: ', response);
                    });
            });

        this.promptStream.next(speechPrompt);
    }

    public give(targetCharacter) {
        this.characterService
            .getInventory()
            .subscribe((items: any[]) => {
                items.forEach((item) => {
                    const itemOption = new Option(`${item.name}: ${item.description}`);

                    itemOption
                        .selectedStream
                        .subscribe(() => {
                            const amountPrompt = new Prompt('How much of this resource do you want to give?');

                            amountPrompt
                                .answerStream
                                .subscribe((amount) => {
                                    amount = Number(amount);

                                    if (amount < 1 || amount > item.count) {
                                        return;
                                    }

                                    this.characterService
                                        .giveItem(item.id, amount, targetCharacter.id)
                                        .subscribe((response) => {
                                            console.log('response', response);
                                        });
                                });

                            this.promptStream.next(amountPrompt);
                        });

                    this.optionsStream.next(itemOption);
                });
            });
    }

    public point(targetCharacter) {
        this.characterService
            .pointAt(targetCharacter.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }

    public attack(targetCharacter) {
        this.characterService
            .attack(targetCharacter.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }

    public toggleShowSleepers() {
        this.isShowingSleepers = !this.isShowingSleepers;
    }
}
