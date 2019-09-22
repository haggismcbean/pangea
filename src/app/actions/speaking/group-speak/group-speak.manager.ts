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
export class GroupSpeakManager {
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

        const groupSpeakOption = new Option('group');

        parentOption.setOption(groupSpeakOption);

        groupSpeakOption
            .selectedStream
            .subscribe(() => this.onGroupSpeakSelect());
    }

    private onGroupSpeakSelect() {
        const messagePrompt = new Prompt('To group: ');

        messagePrompt
            .answerStream
            .subscribe((message) => {
                this.messagesService
                    .sendGroupMessage(message, this.character)
                    .subscribe((response) => {
                        console.log('response: ', response);
                    }, (response) => {
                        const error = new Message(0);
                        error.setText(response.error.message);
                        error.setClass('error-notification');

                        this.mainFeedStream.next(error);
                    });
            });

        this.promptStream.next(messagePrompt);
    }
}
