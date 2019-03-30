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

    private zoneId: number;

    constructor(
        private plantService: PlantService,
        private characterService: CharacterService,
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const labourOption = new Option('do');

        const foragingOption = new Option('foraging');
        const craftingOption = new Option('crafting');

        labourOption.setOptions([foragingOption, craftingOption]);

        foragingOption
            .selectedStream
            .subscribe(() => this.onForagingSelect());

        craftingOption
            .selectedStream
            .subscribe(() => this.onCraftingSelect());

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

    private onCraftingSelect() {
        this.characterService
            .getCraftableItems()
            .subscribe((items: any[]) => {
                const itemsTitle = new Message(0);
                itemsTitle.setText('=== Items ===');

                this.mainFeedStream.next(itemsTitle);

                _.forEach(items, (item) => {
                    this.createItemOption(item);
                    this.createItemMessage(item);
                });
            });
    }

    private createItemOption(item) {
        const itemOption = new Option(item.name);

        const recipeOptions = item.recipes
            .map((recipe) => {
                const recipeOptionName = this.createRecipeOptionName(recipe);
                const recipeOption = new Option(recipeOptionName);

                recipeOption
                    .selectedStream
                    .subscribe(() => this.createItemJob(item, recipe));
                return recipeOption;
            });

        itemOption.setOptions(recipeOptions);

        this.optionsStream.next(itemOption);
    }

    private createRecipeOptionName(recipe) {
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
            return;
        }

        const name = recipe.ingredients
            .reduce((recipeOptionName, ingredient) => {
                if (recipeOptionName) {
                    recipeOptionName += ' ';
                }

                if (ingredient.item) {
                    return recipeOptionName += `${ingredient.item.name}`;
                } else {
                    return recipeOptionName += `${ingredient.item_type}`;
                }
            }, '');

        return name;
    }

    private createItemMessage(item) {
        const itemMessage = new Message(item.id);
        itemMessage.setText(item.name);
        this.mainFeedStream.next(itemMessage);
    }

    private createItemJob(item, recipe) {
        console.log('item to craft: ', item, recipe);
        // I guess first we decide what to put in with the item

        // And then we craft the fuck out of it!

        // this.characterService
        //     .craftItem(item.id);
    }
}
