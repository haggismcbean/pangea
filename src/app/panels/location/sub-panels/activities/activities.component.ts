import { Component, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { ZoneService } from '../../../../services/zone.service';
import { WebSocketService } from '../../../../services/web-socket.service';
import { MessagesService } from '../../../../services/messages.service';
import { CharacterService } from '../../../../services/character.service';

import { Prompt } from '../../../../actions/prompt.model';
import { Option } from '../../../../actions/option.model';

import { Message } from '../../../../models/message.model';
import { Character } from '../../../../models/character.model';

import { getWeatherGlyph } from '../../constants/weather';

@Component({
    selector: 'pan-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
    @Input() public mainFeedStream;
    @Input() public promptStream;
    @Input() public optionsStream;

    @Input() public activities;

    constructor(
        private zoneService: ZoneService,
        private webSocketService: WebSocketService,
        private messagesService: MessagesService,
        private characterService: CharacterService
    ) {}

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
                            const errorMessage = new Message(0);
                            errorMessage.setDate(Date.now());
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
                                if (ingredient.suppliedIngredient) {
                                    ingredient.suppliedIngredient.count += amount;
                                } else {
                                    ingredient.suppliedIngredient = {
                                        count: amount
                                    };
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
