import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { PlantService } from '../../services/plant.service';
import { CharacterService } from '../../services/character.service';

import { Character } from '../../models/character.model';
import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';

import * as _ from 'lodash';

@Component({
    selector: 'pan-plants',
    templateUrl: './plants.component.html',
    styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit {
    @Input() public promptStream;
    @Input() public optionsStream;

    public character: Character;
    public plantGroups;
    public groupedPlants;

    private zoneId;
    private plants;

    constructor(
        private zoneService: ZoneService,
        private plantService: PlantService,
        private characterService: CharacterService
    ) {}

    ngOnInit() {
        this.character = this.characterService.getCurrent();
        this.getPlants();
    }

    private getPlants() {
        this.zoneService
            .getZonePlants(this.character.zoneId)
            .subscribe((plants: any[]) => {
                this.plants = plants;

                // okay so first we split them into different types
                const groupedPlants = _.groupBy(plants, plant => plant.typeName);

                this.plantGroups = Object.keys(groupedPlants);
                this.groupedPlants = groupedPlants;

                this.getGatheredPlants();
            });
    }

    private getGatheredPlants() {
        this.characterService
            .getInventory()
            .subscribe((items: any[]) => {
                this.assignInventoryPlantsToPlant(items);

            });
    }

    private assignInventoryPlantsToPlant(inventoryItems) {
        _.forEach(this.plants, (plant) => {
            if (!plant.inventory) {
                plant.inventory = {};
            }

            const inventoryPlant = _.find(inventoryItems, (item) => {
                return item.item_type === 'plant' && item.type_id === plant.id;
            });

            if (inventoryPlant) {
                plant.inventory[inventoryPlant.name] = inventoryPlant;
            }
        });
    }

    public name(plant) {
        // do a prompt!
        this.sendPrompt('Enter plant name', plant);
    }

    private sendPrompt(promptText: string, plant) {
        const plantPrompt = new Prompt(promptText);

        plantPrompt
            .answerStream
            .subscribe((name: string) => {
                this.plantService
                    .name(plant, name)
                    .subscribe(() => {
                        plant.customName = name;
                    });
            });

        this.promptStream.next(plantPrompt);
    }

    public share(plant) {
        this.characterService
            .getCharacters({ isCacheBust: true })
            .subscribe((characters) => {
                _.forEach(characters, character => {
                    const characterOption = new Option(character.name);

                    characterOption
                        .selectedStream
                        .subscribe(() => {
                            this.plantService
                                .share(plant, character)
                                .subscribe((response) => {
                                    console.log('response: ', response);
                                });
                        });

                    this.optionsStream.next(characterOption);
                });
            });
    }

    public gather(plant, plantPiece) {
        const amountPrompt = new Prompt('How much of this plant do you want to gather?');

        amountPrompt
            .answerStream
            .subscribe((amount) => {
                amount = Number(amount);

                if (amount < 1) {
                    return;
                }

                this.plantService
                    .gather({
                        plantId: plant.id,
                        plantPiece: plantPiece,
                        amount: amount
                    })
                    .subscribe((response) => {
                        if (plant.inventory[plantPiece]) {
                            plant.inventory[plantPiece].count += amount;
                        } else {
                            plant.inventory[plantPiece] = {
                                id: response.item_id,
                                count: amount
                            };
                        }
                    });
            });

        this.promptStream.next(amountPrompt);
    }

    public eat(inventoryItem) {
        this.characterService
            .eat(inventoryItem.id)
            .subscribe((response) => {
                inventoryItem.count--;
            });
    }
}
