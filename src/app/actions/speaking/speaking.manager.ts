import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';

import { CharacterService } from '../../services/character.service';

import { GroupSpeakManager } from './group-speak/group-speak.manager';
import { ZoneSpeakManager } from './zone-speak/zone-speak.manager';

import * as _ from 'lodash';

@Injectable()
export class SpeakingManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;
    private panelStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private groupSpeakManager: GroupSpeakManager,
        private zoneSpeakManager: ZoneSpeakManager
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, panelStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;
        this.panelStream = panelStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const speakOption = new Option('speak to');

        this.groupSpeakManager.init(mainFeedStream, optionsStream, promptStream, speakOption);
        this.zoneSpeakManager.init(mainFeedStream, optionsStream, promptStream, speakOption);

        speakOption.isConcat = true;

        this.optionsStream.next(speakOption);
    }
}
