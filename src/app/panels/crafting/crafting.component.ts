import { Component, OnChanges, Input } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { PlantService } from '../../services/plant.service';
import { CharacterService } from '../../services/character.service';

import { Character } from '../../models/character.model';
import { Message } from '../../models/message.model';
import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';

import * as _ from 'lodash';

@Component({
    selector: 'pan-crafting',
    templateUrl: './crafting.component.html',
    styleUrls: ['./crafting.component.scss']
})
export class CraftingComponent implements OnChanges {
    @Input() public mainFeedStream;
    @Input() public promptStream;
    @Input() public optionsStream;

    public character: Character;
    public items = [];

    public itemGroups;
    public groupedItems;

    constructor(
        private zoneService: ZoneService,
        private plantService: PlantService,
        private characterService: CharacterService
    ) {
    }

    ngOnChanges(changes) {
        this.character = this.characterService.getCurrent();

        this.characterService
            .getCraftableItems()
            .subscribe((items: any[]) => {
                this.items = items;

                const groupedItems = _.groupBy(items, item => item.category);

                this.itemGroups = Object.keys(groupedItems);
                this.groupedItems = groupedItems;
            });
    }

    public craft(recipe) {
        this.characterService
            .craftRecipe(recipe.id)
            .subscribe((activity) => {
                recipe.activity = activity;
            });
    }

    public addResource(activity, ingredient) {
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
                            console.log('fail');
                            const errorMessage = new Message(0);
                            errorMessage.setSource({
                                id: 0,
                                name: 'system'
                            });
                            errorMessage.setText(`Cannot find any of that item in your inventory`);

                            this.mainFeedStream
                                .next(errorMessage);
                            return;
                        }

                        this.characterService
                            .addItemToActivity(activity.id, itemToAdd.id, amount)
                            .subscribe((response) => {
                                if (!ingredient.suppliedIngredient) {
                                    ingredient.suppliedIngredient = {
                                        count: amount
                                    };
                                } else {
                                    ingredient.suppliedIngredient.count += amount;
                                }
                            });
                    });
            });

        this.promptStream.next(amountPrompt);
    }

    public workOn(activity) {
        this.characterService
            .workOnActivity(activity.id)
            .subscribe((response) => {
                console.log('resposne: ', response);
            });
    }
}
