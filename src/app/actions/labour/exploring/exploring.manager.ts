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
export class ExploringManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private zoneService: ZoneService,
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const exploringOption = new Option('exploring');

        parentOption.setOption(exploringOption);

        exploringOption
            .selectedStream
            .subscribe(() => this.onExploreSelect());
    }

    private onExploreSelect() {
        this.zoneService
            .explore(this.zoneId)
            .subscribe((exploreActivity) => {
                if (exploreActivity.progress === 100) {
                    const resetMessage = new Message(0);
                    resetMessage.class = 'reset';

                    this.mainFeedStream
                        .next(resetMessage);
                } else {
                    const cancelActivityOption = new Option('cancel');

                    cancelActivityOption
                        .selectedStream
                        .subscribe(() => this.cancelActivity(exploreActivity));

                    this.optionsStream.next(cancelActivityOption);
                }

            }, (response) => {
                const error = new Message(0);
                error.setText(response.error.message);
                error.setClass('error-notification');

                this.mainFeedStream.next(error);
            });
    }

    private cancelActivity(activity) {
        this.characterService
            .cancelActivity(activity.id)
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
