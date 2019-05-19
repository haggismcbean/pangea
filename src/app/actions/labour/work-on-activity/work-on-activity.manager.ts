import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { FarmService } from '../../../services/farm.service';
import { ZoneService } from '../../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class WorkOnActivityManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private farmService: FarmService,
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const workOnActivityOption = new Option('work on activity');

        parentOption.setOption(workOnActivityOption);

        workOnActivityOption
            .selectedStream
            .subscribe(() => this.onWorkOnActivitySelect());
    }

    private onWorkOnActivitySelect() {
        this.zoneService
            .getActivities(this.zoneId)
            .subscribe((activities) => {
                _.forEach(activities, (activity) => {
                    if (!activity.item) {
                        return;
                    }

                    const activityOption = new Option(activity.item.name);

                    activityOption
                        .selectedStream
                        .subscribe(() => {
                            this.characterService
                                .workOnActivity(activity.id)
                                .subscribe((response) => {
                                    console.log('resposne: ', response);
                                });
                        });

                    this.optionsStream.next(activityOption);
                });
            });
    }
}
