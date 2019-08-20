import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';

import { CharacterService } from '../../services/character.service';
import { ZoneService } from '../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class MovementManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    constructor(
        private characterService: CharacterService,
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        const moveToOption = new Option('move to');
        const zoneId = this.characterService
            .getCurrent()
            .zoneId;

        this.zoneService
            .getBorderingZones(zoneId)
            .subscribe((zones) => {
                const zoneOptions = [];

                if (zones.parentZone) {
                    const newZone = this.createZoneOption(zones.parentZone);
                    zoneOptions.push(newZone);
                }

                _.each(zones.siblingZones, (zone, zoneName) => {
                    if (zone) {
                        const newZone = this.createZoneOption(zone, zoneName);
                        zoneOptions.push(newZone);
                    }
                });

                _.each(zones.childZones, (zone) => {
                    const newZone = this.createZoneOption(zone);
                    zoneOptions.push(newZone);
                });

                moveToOption.setOptions(zoneOptions);
            });

        moveToOption.isConcat = true;

        this.optionsStream.next(moveToOption);
    }

    private createZoneOption(zone, zoneName?): Option {
        const newZone = new Option(zoneName || zone.name);
        newZone
            .selectedStream
            .subscribe(() => {
                this.onZoneOptionSelect(zone);
            });

        return newZone;
    }

    private onZoneOptionSelect(zone): void {
        this.zoneService
            .changeZones(zone.id)
            .subscribe((response) => {
                const resetMessage = new Message(0);
                resetMessage.class = 'reset';
            });
    }
}
