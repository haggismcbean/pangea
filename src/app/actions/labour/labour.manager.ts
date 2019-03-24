import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';

import { PlantService } from '../../services/plant.service';
import { CharacterService } from '../../services/character.service';
import { ZoneService } from '../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class LabourManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    constructor(
        private plantService: PlantService,
        private characterService: CharacterService,
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        const zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const labourOption = new Option('do');

        const foragingOption = new Option('foraging');

        labourOption.setOptions([foragingOption]);

        foragingOption
            .selectedStream
            .subscribe(() => {
                this.zoneService
                    .getZonePlants(zoneId)
                    .subscribe((plants: any[]) => {
                        console.log('plants: ', plants);

                        _.forEach(plants, (plant) => {
                            const plantOption = new Option(`${plant.typeName} ${plant.id}`);

                            const plantParts = [];

                            // TODO - check if season for flowers
                            if (plant.hasFlower) {
                                const flowerOption = new Option('flower');
                                plantParts.push(flowerOption);

                                flowerOption
                                    .selectedStream
                                    .subscribe(() => {
                                        this.gatherPlantPart(plant.id, 'flower');
                                    });
                            }

                            // TODO - check if season for flowers
                            if (plant.hasFruit) {
                                const fruitOption = new Option('fruit');
                                plantParts.push(fruitOption);
                                
                                fruitOption
                                    .selectedStream
                                    .subscribe(() => {
                                        this.gatherPlantPart(plant.id, 'fruit');
                                    });
                            }

                            if (plant.hasWood) {
                                const woodOption = new Option('wood');
                                plantParts.push(woodOption);
                                
                                woodOption
                                    .selectedStream
                                    .subscribe(() => {
                                        this.gatherPlantPart(plant.id, 'wood');
                                    });
                            }

                            // TODO - check if season for seeds
                            const seedOption = new Option('seed');
                            plantParts.push(seedOption);

                            seedOption
                                .selectedStream
                                .subscribe(() => {
                                    this.gatherPlantPart(plant.id, 'seed');
                                });

                            plantOption.setOptions(plantParts);

                            this.optionsStream.next(plantOption);
                        });
                    });
            });

        this.optionsStream.next(labourOption);
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
