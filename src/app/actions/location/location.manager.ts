import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';
import { Character } from '../../models/character.model';

import { CharacterService } from '../../services/character.service';
import { ZoneService } from '../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class LocationManager {
    private zoneId: number;

    private mainFeedStream;
    private optionsStream;
    private promptStream;
    private panelStream;

    constructor(
        private characterService: CharacterService,
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, panelStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;
        this.panelStream = panelStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const lookAtOption = new Option('look at');

        const plantsOption = new Option('plants');
        const locationOption = new Option('location');
        const inventoryOption = new Option('inventory');
        const craftingOption = new Option('crafting');

        lookAtOption.setOptions([plantsOption, locationOption, inventoryOption, craftingOption]);

        plantsOption
            .selectedStream
            .subscribe(() => this.handlePlantsOptionSelected());

        locationOption
            .selectedStream
            .subscribe(() => this.handleLocationOptionSelected());

        inventoryOption
            .selectedStream
            .subscribe(() => this.handleInventoryOptionSelected());

        craftingOption
            .selectedStream
            .subscribe(() => this.handleCraftingOptionSelected());

        lookAtOption.isConcat = true;

        this.optionsStream.next(lookAtOption);
    }

    private handlePlantsOptionSelected() {
        this.panelStream.next('plants');
    }

    private handleLocationOptionSelected() {
        this.panelStream.next('location');
    }

    private handleInventoryOptionSelected() {
        this.panelStream.next('inventory');
    }

    private handleCraftingOptionSelected() {
        this.panelStream.next('crafting');
    }

    private resetOptions() {
        const resetMessage = new Message(0);
        resetMessage.class = 'reset';

        this.mainFeedStream
            .next(resetMessage);
    }

}
