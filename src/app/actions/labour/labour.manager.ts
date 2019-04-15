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
        const huntingOption = new Option('hunting');
        const craftingOption = new Option('new item');
        const addResourcesOption = new Option('add to activity');
        const workOnActivityOption = new Option('work on activity');

        labourOption.setOptions([
            foragingOption,
            huntingOption,
            craftingOption,
            addResourcesOption,
            workOnActivityOption
        ]);

        foragingOption
            .selectedStream
            .subscribe(() => this.onForagingSelect());

        huntingOption
            .selectedStream
            .subscribe(() => this.onHuntingSelect());

        craftingOption
            .selectedStream
            .subscribe(() => this.onCraftingSelect());

        addResourcesOption
            .selectedStream
            .subscribe(() => this.onAddResourcesSelect());

        workOnActivityOption
            .selectedStream
            .subscribe(() => this.onWorkOnActivitySelect());

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

    private onHuntingSelect() {
        // TODO - get item rather than just always use a spear!!
        this.characterService
            .hunt(7)
            .subscribe((response) => {
                console.log('response from hunting');
            });
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
            return 'no ingredients';
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
        // The finished message will be in the webhook
        this.characterService
            .craftRecipe(recipe.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }

    private onAddResourcesSelect() {
        this.zoneService
            .getActivities(this.zoneId)
            .subscribe((activities) => {
                _.forEach(activities, (activity) => {
                    const itemMessage = new Message(0);
                    itemMessage.setText(`${activity.item.name}`);

                    this.mainFeedStream
                        .next(itemMessage);

                    this.createActivityOption(activity);
                });
            });
    }

    private createActivityOption(activity) {
        const activityOption = new Option(activity.item.name);

        const activityIngredientOptions = [];

        _.forEach(activity.ingredients, (ingredient) => {
            const ingredientOption = this.createIngredientOption(activity, ingredient);
            activityIngredientOptions.push(ingredientOption);
        });

        activityOption.setOptions(activityIngredientOptions);
        this.optionsStream.next(activityOption);
    }

    private createIngredientOption(activity, ingredient) {
        const ingredientMessage = new Message(0);
        const ingredientName = ingredient.item || ingredient.item_type;
        ingredientMessage.setText(
            `${ingredientName}: ${ingredient.quantity_added} out of ${ingredient.quantity_required} added`
        );

        this.mainFeedStream
            .next(ingredientMessage);

        if (ingredient.quantity_required > ingredient.quantity_added) {
            const ingredientOption = new Option(ingredientName);

            ingredientOption
                .selectedStream
                .subscribe(() => this.onAddToActivitySelected(activity, ingredient));

            return ingredientOption;
        }
    }

    private onAddToActivitySelected(activity, ingredient) {
        const amountPrompt = new Prompt('How much of this resource do you want to add?');

        amountPrompt
            .answerStream
            .subscribe((amount) => {
                this.characterService
                    .getInventory()
                    .subscribe((inventoryItems) => {
                        const itemToAdd = _.find(inventoryItems, (inventoryItem) => {
                            return inventoryItem.name === ingredient.item_type || inventoryItem.id === ingredient.item_id;
                        });

                        if (!itemToAdd) {
                            const errorMessage = new Message(0);
                            errorMessage.setText(`Cannot find any of that item in your inventory`);

                            this.mainFeedStream
                                .next(errorMessage);
                            return;
                        }

                        this.characterService
                            .addItemToActivity(activity.id, itemToAdd.id, amount)
                            .subscribe((response) => {
                                console.log('response: ', response);
                            });
                    });
            });

        this.promptStream.next(amountPrompt);
    }

    private onWorkOnActivitySelect() {
        this.zoneService
            .getActivities(this.zoneId)
            .subscribe((activities) => {
                _.forEach(activities, (activity) => {
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
