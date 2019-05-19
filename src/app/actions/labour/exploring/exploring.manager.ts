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
                const cancelActivityOption = new Option('cancel');

                cancelActivityOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(exploreActivity));

                this.optionsStream.next(cancelActivityOption);
            });
    }

    private cancelActivity(activity) {
        this.characterService
            .cancelActivity(activity.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }
}
