import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';

import { PlantService } from '../../services/plant.service';
import { CharacterService } from '../../services/character.service';
import { ZoneService } from '../../services/zone.service';

import { HuntingManager } from './hunting/hunting.manager';
import { FarmingManager } from './farming/farming.manager';
import { MiningManager } from './mining/mining.manager';
import { CraftingManager } from './crafting/crafting.manager';
import { AddToActivityManager } from './add-to-activity/add-to-activity.manager';
import { WorkOnActivityManager } from './work-on-activity/work-on-activity.manager';
import { ExploringManager } from './exploring/exploring.manager';

import * as _ from 'lodash';

@Injectable()
export class LabourManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;
    private panelStream;

    private zoneId: number;

    constructor(
        private plantService: PlantService,
        private characterService: CharacterService,
        private zoneService: ZoneService,

        private huntingManager: HuntingManager,
        private farmingManager: FarmingManager,
        private miningManager: MiningManager,
        private craftingManager: CraftingManager,
        private addToActivityManager: AddToActivityManager,
        private workOnActivityManager: WorkOnActivityManager,
        private exploringManager: ExploringManager
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, panelStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;
        this.panelStream = panelStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const labourOption = new Option('do');

        this.huntingManager.init(mainFeedStream, optionsStream, promptStream, labourOption);
        this.farmingManager.init(mainFeedStream, optionsStream, promptStream, labourOption);
        this.miningManager.init(mainFeedStream, optionsStream, promptStream, labourOption);
        this.craftingManager.init(mainFeedStream, optionsStream, promptStream, labourOption);
        this.addToActivityManager.init(mainFeedStream, optionsStream, promptStream, labourOption);
        this.workOnActivityManager.init(mainFeedStream, optionsStream, promptStream, labourOption);
        this.exploringManager.init(mainFeedStream, optionsStream, promptStream, labourOption);

        labourOption.isConcat = true;

        this.optionsStream.next(labourOption);
    }
}
