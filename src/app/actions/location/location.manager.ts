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

        const zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const lookAtOption = new Option('look at');

        const peopleOption = new Option('people');
        const plantsOption = new Option('plants');
        const animalsOption = new Option('animals');
        const toolsOption = new Option('tools');

        lookAtOption.setOptions([peopleOption, plantsOption, animalsOption, toolsOption]);

        peopleOption
            .selectedStream
            .subscribe(() => {
                // once the user decides to look at people, we have to get the list of people!
                this.zoneService
                    .getZoneCharacters(zoneId)
                    .subscribe((characters: Character[]) => {
                        _.forEach(characters, (character) => {
                            const characterOption = new Option(character.name);

                            characterOption
                                .selectedStream
                                .subscribe(() => {
                                    const characterDescription = new Message(0);
                                    characterDescription.setText(character.appearance);

                                    this.mainFeedStream
                                        .next(characterDescription);

                                    const resetMessage = new Message(0);
                                    resetMessage.class = 'reset';

                                    this.mainFeedStream
                                        .next(resetMessage);
                                });

                            this.optionsStream.next(characterOption);
                        });
                    });
            });

        plantsOption
            .selectedStream
            .subscribe(() => {
                this.zoneService
                    .getZonePlants(zoneId)
                    .subscribe((plants: any[]) => {
                        _.forEach(plants, (plant) => {
                            const plantOption = new Option(`${plant.typeName} ${plant.id}`);

                            plantOption
                                .selectedStream
                                .subscribe(() => {
                                    const leafDescription = new Message(0);
                                    leafDescription.setText(plant.leafAppearance);

                                    const flowerDescription = new Message(0);
                                    flowerDescription.setText(plant.flowerAppearance);

                                    const seedDescription = new Message(0);
                                    seedDescription.setText(plant.seedAppearance);

                                    const woodDescription = new Message(0);
                                    woodDescription.setText(plant.woodAppearance);

                                    this.mainFeedStream
                                        .next(leafDescription);

                                    this.mainFeedStream
                                        .next(flowerDescription);

                                    this.mainFeedStream
                                        .next(seedDescription);

                                    this.mainFeedStream
                                        .next(woodDescription);

                                    const resetMessage = new Message(0);
                                    resetMessage.class = 'reset';

                                    this.mainFeedStream
                                        .next(resetMessage);
                                });

                            this.optionsStream.next(plantOption);
                        });
                    });
            });

        animalsOption
            .selectedStream
            .subscribe(() => {
                console.log('animalsOption selected!');
            });

        toolsOption
            .selectedStream
            .subscribe(() => {
                console.log('toolsOption selected!');
            });

        this.optionsStream.next(lookAtOption);
    }
}
