import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';
import { ZoneService } from '../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class MovementManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    constructor(
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        const moveToOption = new Option('move to');

        this.zoneService
            .getBorderingZones(1)
            .subscribe((zones) => {
                const zoneOptions = [];

                _.each(zones.borderZones, (zone, zoneName) => {
                    if (zone) {
                        const newZone = new Option(zoneName);
                        newZone
                            .selectedStream
                            .subscribe(() => {
                                this.onZoneOptionSelect(zone);
                            });

                        zoneOptions.push(newZone);
                    }
                });

                _.each(zones.zones, (zone) => {
                    const newZone = new Option(zone.name);
                    newZone
                        .selectedStream
                        .subscribe(() => {
                            this.onZoneOptionSelect(zone);
                        });

                    zoneOptions.push(newZone);
                });

                moveToOption.setOptions(zoneOptions);
            });

        this.optionsStream.next(moveToOption);
    }

    private onZoneOptionSelect(zone): void {
        this.zoneService
            .changeZones(zone.id)
            .subscribe((newZone) => {
                const resetMessage = new Message(0);
                resetMessage.class = 'reset';

                this.mainFeedStream
                    .next(resetMessage);

                const newZoneDescription = new Message(0);
                newZoneDescription.setText(newZone.description);

                this.mainFeedStream
                    .next(newZoneDescription);
            });
    }
}
