import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { ZoneService } from '../../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class HuntingManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const huntingOption = new Option('hunting');

        parentOption.setOption(huntingOption);

        huntingOption
            .selectedStream
            .subscribe(() => this.onHuntingSelect());
    }

    private onHuntingSelect() {
        // TODO - get item rather than just always use a spear!!
        this.characterService
            .hunt(7)
            .subscribe((huntActivity) => {
                const cancelHuntOption = new Option('cancel');

                cancelHuntOption
                    .selectedStream
                    .subscribe(() => this.cancelHunt(huntActivity));

                this.optionsStream.next(cancelHuntOption);
            });
    }

    private cancelHunt(huntActivity) {
        this.characterService
            .cancelActivity(huntActivity.id)
            .subscribe((response) => {
                console.log('response: ', response);
            }, (response) => {
                const error = new Message(0);
                error.setText(response.error.message);
                error.setClass('error-notification');

                this.mainFeedStream.next(error);
            });
    }
}
