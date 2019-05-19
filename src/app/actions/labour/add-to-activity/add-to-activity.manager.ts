import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { FarmService } from '../../../services/farm.service';
import { ZoneService } from '../../../services/zone.service';

import * as _ from 'lodash';

@Injectable()
export class AddToActivityManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private farmService: FarmService,
        private zoneService: ZoneService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const addResourcesOption = new Option('add to activity');

        parentOption.setOption(addResourcesOption);

        addResourcesOption
            .selectedStream
            .subscribe(() => this.onAddResourcesSelect());
    }

    private onAddResourcesSelect() {
        this.zoneService
            .getActivities(this.zoneId)
            .subscribe((activities) => {

                _.forEach(activities, (activity) => {
                    if (activity.item && activity.ingredients && activity.ingredients.length > 0) {
                        const itemMessage = new Message(0);
                        itemMessage.setText(`${activity.item.name}`);

                        this.mainFeedStream
                            .next(itemMessage);

                        this.createActivityOption(activity);
                    }
                });
            });
    }

    private createActivityOption(activity) {
        const activityOption = new Option(activity.item.name);
        const activityIngredientOptions = [];

        _.forEach(activity.ingredients, (ingredient) => {
            const ingredientOption = this.createIngredientOption(activity, ingredient);

            if (ingredientOption) {
                activityIngredientOptions.push(ingredientOption);
            }
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
                        console.log(inventoryItems);
                        const itemToAdd = _.find(inventoryItems, (inventoryItem) => {
                            if (ingredient.item_id === null) {
                                return inventoryItem.name === ingredient.item_type;
                            }

                            if (ingredient.item_type === null) {
                                return inventoryItem.id === ingredient.item_id;
                            }
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
}
