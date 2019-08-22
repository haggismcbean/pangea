import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { MessagesService } from '../../../services/messages.service';
import { ZoneService } from '../../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class ZoneSpeakManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private character;

    constructor(
        private characterService: CharacterService,
        private messagesService: MessagesService,
        private zoneService: ZoneService,
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.character = this.characterService.getCurrent();


        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        console.log('this.character: ', this.character);

        this.zoneService
            .getDescription(this.character.zoneId)
            .subscribe((zone) => {
                if (zone.parent_id) {
                    const zoneSpeakOption = new Option('location');

                    parentOption.setOption(zoneSpeakOption);

                    zoneSpeakOption
                        .selectedStream
                        .subscribe(() => this.onSpeakSelect());
                }
            });
    }

    private onSpeakSelect() {
        const messagePrompt = new Prompt('To location: ');

        messagePrompt
            .answerStream
            .subscribe((message) => {
                this.messagesService
                    .sendMessage(message, this.character)
                    .subscribe((response) => {
                        console.log('response: ', response);
                    });
            });

        this.promptStream.next(messagePrompt);
    }
}
