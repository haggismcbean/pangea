import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { PlantService } from '../../../services/plant.service';
import { CharacterService } from '../../../services/character.service';
import { ZoneService } from '../../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class ForagingManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private plantService: PlantService,
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

        const foragingOption = new Option('foraging');

        parentOption.setOption(foragingOption);

        foragingOption
            .selectedStream
            .subscribe(() => this.onForagingSelect());
    }

    private onForagingSelect() {
        this.zoneService
            .getZonePlants(this.zoneId)
            .subscribe((plants: any[]) => {
                _.forEach(plants, (plant) => {
                    const plantOption = new Option(`${plant.typeName} ${plant.id}`);

                    const plantParts = [];

                    // TODO - check if season for flowers
                    if (plant.hasFlower) {
                        const flowerOption = this.createPlantOption('flower', plant);
                        plantParts.push(flowerOption);
                    }

                    // TODO - check if season for flowers
                    if (plant.hasFruit) {
                        const fruitOption = this.createPlantOption('fruit', plant);
                        plantParts.push(fruitOption);
                    }

                    if (plant.hasWood) {
                        const woodOption = this.createPlantOption('wood', plant);
                        plantParts.push(woodOption);
                    }

                    // TODO - check if season for seeds
                    const seedOption = this.createPlantOption('seed', plant);
                    plantParts.push(seedOption);

                    plantOption.setOptions(plantParts);

                    this.optionsStream.next(plantOption);
                });
            });
    }

    private createPlantOption(optionName, plant) {
        const plantOption = new Option(optionName);

        plantOption
            .selectedStream
            .subscribe(() => this.gatherPlantPart(plant.id, optionName));

        return plantOption;
    }

    private gatherPlantPart(plantId: number, plantPiece: string) {
        this.plantService
            .gather({
                plantId: plantId,
                plantPiece: plantPiece
            })
            .subscribe((response) => {
                console.log('done: ', response);
            });
    }
}
