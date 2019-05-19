import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { FarmService } from '../../../services/farm.service';

import * as _ from 'lodash';

@Injectable()
export class CraftingManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private farmService: FarmService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const craftingOption = new Option('new item');

        parentOption.setOption(craftingOption);

        craftingOption
            .selectedStream
            .subscribe(() => this.onCraftingSelect());
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
}
