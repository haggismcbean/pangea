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
    private zoneId: number;

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

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const lookAtOption = new Option('look at');

        const peopleOption = new Option('people');
        const plantsOption = new Option('plants');
        const locationOption = new Option('loose items');
        const inventoryOption = new Option('inventory');
        const activitiesOption = new Option('activities');

        lookAtOption.setOptions([peopleOption, plantsOption, locationOption, inventoryOption, activitiesOption]);

        peopleOption
            .selectedStream
            .subscribe(() => this.handlePeopleOptionSelected());

        plantsOption
            .selectedStream
            .subscribe(() => this.handlePlantsOptionSelected());

        locationOption
            .selectedStream
            .subscribe(() => this.handleLocationOptionSelected());

        inventoryOption
            .selectedStream
            .subscribe(() => this.handleInventoryOptionSelected());

        activitiesOption
            .selectedStream
            .subscribe(() => this.handleActivitiesOptionSelected());

        lookAtOption.isConcat = true;

        this.optionsStream.next(lookAtOption);
    }

    private handlePeopleOptionSelected() {
        // once the user decides to look at people, we have to get the list of people!
        this.zoneService
            .getZoneCharacters(this.zoneId)
            .subscribe((characters: Character[]) => {
                _.forEach(characters, (character) => {
                    const characterOption = new Option(character.name);

                    characterOption
                        .selectedStream
                        .subscribe(() => this.handleCharacterOptionSelected(character));

                    this.optionsStream.next(characterOption);
                });
            });
    }

    private handleCharacterOptionSelected(character) {
        const characterDescription = new Message(0);
        characterDescription.setText(character.appearance);

        this.mainFeedStream
            .next(characterDescription);

        this.resetOptions();
    }

    private handlePlantsOptionSelected() {
        this.zoneService
            .getZonePlants(this.zoneId)
            .subscribe((plants: any[]) => {
                _.forEach(plants, (plant) => {
                    const plantOption = new Option(`${plant.typeName} ${plant.id}`);

                    plantOption
                        .selectedStream
                        .subscribe(() => this.handlePlantOptionSelected(plant));

                    this.optionsStream.next(plantOption);
                });
            });
    }

    private handlePlantOptionSelected(plant) {
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

        this.resetOptions();
    }

    private handleLocationOptionSelected() {
        this.zoneService
            .getZoneInventory(this.zoneId)
            .subscribe((items: any[]) => {
                this.showItemsAsMessages(items, 'the location');

                _.forEach(items, (item) => {
                    const itemOption = new Option(`${item.name} ${item.id}`);

                    const descriptionOption = new Option('description');
                    const pickUpOption = new Option('pick up');

                    itemOption.setOptions([descriptionOption, pickUpOption]);

                    descriptionOption
                        .selectedStream
                        .subscribe(() => this.handleItemDescriptionOptionSelected(item));

                    pickUpOption
                        .selectedStream
                        .subscribe(() => this.handleItemPickUpOptionSelected(item));

                    this.optionsStream.next(itemOption);
                });

                this.resetOptions();
            });
    }

    private handleItemDescriptionOptionSelected(item) {
        const itemDescription = new Message(0);
        itemDescription.setText(
            `You look at a ${item.name}. ${item.description}There is a total of ${item.count}`
        );

        this.mainFeedStream
            .next(itemDescription);

        this.resetOptions();
    }

    private handleItemPickUpOptionSelected(item) {
        const amountPrompt = new Prompt(`how much would you like to pick up? (max ${item.count})`);

        amountPrompt
            .answerStream
            .subscribe((amount: string) => {
                const itemQuantity = Number(amount);

                if (itemQuantity < 0 || itemQuantity > item.count) {
                    this.resetOptions();
                    return;
                }

                item.count -= itemQuantity;

                this.zoneService
                    .pickUp(item.id, itemQuantity)
                    .subscribe(
                        (response) => this.handleItemMoveSuccess('put down', item, response),
                        (error) => this.resetOptions()
                    );
            });

        this.promptStream.next(amountPrompt);
    }

    private handleInventoryOptionSelected() {
        this.characterService
            .getInventory()
            .subscribe((items: any[]) => {
                this.showItemsAsMessages(items, 'your inventory');

                _.forEach(items, (item) => {
                    const itemOption = new Option(`${item.name} ${item.id}`);

                    const descriptionOption = new Option('description');
                    const putDownOption = new Option('put down');

                    itemOption.setOptions([descriptionOption, putDownOption]);

                    itemOption
                        .selectedStream
                        .subscribe(() => this.handleItemDescriptionOptionSelected(item));

                    putDownOption
                        .selectedStream
                        .subscribe(() => this.handleItemPutDownOptionSelected(item));

                    this.optionsStream.next(itemOption);
                });

                this.resetOptions();
            });
    }

    private handleItemPutDownOptionSelected(item) {
        const amountPrompt = new Prompt(`how much would you like to put down? (max ${item.count})`);

        amountPrompt
            .answerStream
            .subscribe((amount: string) => {
                const itemQuantity = Number(amount);

                if (itemQuantity < 0 || itemQuantity > item.count) {
                    this.resetOptions();
                    return;
                }

                item.count -= itemQuantity;

                this.characterService
                    .putDown(item.id, itemQuantity)
                    .subscribe(
                        (response) => this.handleItemMoveSuccess('put down', item, response),
                        (error) => this.resetOptions()
                    );
            });

        this.promptStream.next(amountPrompt);
    }

    private handleItemMoveSuccess(movementName, item, response) {
        const itemDescription = new Message(0);

        if (movementName === 'put down') {
            itemDescription.setText(
                `You put some some ${item.name}s down on the ground. There are ${item.count} left in your inventory`
            );
        } else {
            itemDescription.setText(
                `You pick some some ${item.name}s up off the ground. There are ${item.count} left on the ground`
            );
        }

        this.mainFeedStream
            .next(itemDescription);

        this.resetOptions();
    }

    private showItemsAsMessages(items, placeName) {
        const placeMessage = new Message(0);
        placeMessage.setText(`======== Items in ${placeName} ========`);

        this.mainFeedStream
            .next(placeMessage);

        _.forEach(items, (item) => {
            const itemMessage = new Message(0);
            itemMessage.setText(`${item.count} units of ${item.name} ${item.id}`);

            this.mainFeedStream
                .next(itemMessage);
        });
    }

    private resetOptions() {
        const resetMessage = new Message(0);
        resetMessage.class = 'reset';

        this.mainFeedStream
            .next(resetMessage);
    }

    private handleActivitiesOptionSelected() {
        this.zoneService
            .getActivities(this.zoneId)
            .subscribe((activities) => {
                const activitiesMessage = new Message(0);
                activitiesMessage.setText('===== Activities in current location =====');

                this.mainFeedStream
                    .next(activitiesMessage);

                _.forEach(activities, (activity) => {
                    const activityMessage = new Message(0);
                    activityMessage.setText(`${activity.item.name}: ${activity.progress} percent complete`);

                    this.mainFeedStream
                        .next(activityMessage);

                    _.forEach(activity.ingredients, (ingredient) => {
                        const itemMessage = new Message(0);
                        const itemName = ingredient.item || ingredient.item_type;
                        itemMessage.setText(`${itemName}: ${ingredient.quantity_added} out of ${ingredient.quantity_required} added`);

                        this.mainFeedStream
                            .next(itemMessage);
                    });
                });

                this.resetOptions();
            });
    }
}
