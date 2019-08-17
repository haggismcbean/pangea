import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { ZoneService } from '../../services/zone.service';
import { WebSocketService } from '../../services/web-socket.service';
import { MessagesService } from '../../services/messages.service';
import { CharacterService } from '../../services/character.service';

import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';

import { Character } from '../../models/character.model';

import { getWeatherGlyph } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    @Input() public character: Character;
    @Input() public promptStream;
    @Input() public optionsStream;

    public location = {
        characters: [],
        awakePeople: [],
        asleepPeopleCount: 0,
        items: [],
        activities: [],
        display: {
            isShowingSleepers: false,
            isShowingItems: false,
            tabs: {
                isShowingItems: true,
                isShowingPeople: false,
                isShowingActivities: false
            }
        }
    };

    public weatherGlyph;

    constructor(
        private zoneService: ZoneService,
        private webSocketService: WebSocketService,
        private messagesService: MessagesService,
        private characterService: CharacterService
    ) {}

    ngOnInit() {
        this.zoneService
            .getZoneInventory(this.character.zoneId)
            .subscribe((items: any[]) => {
                this.location.items = items;
            });

        this.zoneService
            .getActivities(this.character.zoneId)
            .subscribe((activities) => {
                this.location.activities = activities;
            });

        const getZoneDescription = this.zoneService
            .getDescription(this.character.zoneId);

        const getZoneUsers = this.webSocketService
            .zoneUsersStream;

        combineLatest(getZoneDescription, getZoneUsers)
            .subscribe((results) => {
                const location = results[0];
                const awakePeople = results[1];

                this.setLocation(location);
                this.setWeather(location);

                this.location.awakePeople = awakePeople;
                this.assignWakers();
            });
    }

    private setLocation(location) {
        this.location = _.assign(this.location, location);
    }

    private setWeather(location) {
        this.weatherGlyph = getWeatherGlyph({
            temperature: location.current_temperature,
            rainfall: location.current_rainfall,
        });
    }

    private assignWakers() {
        if (this.location.characters.length === 0 || this.location.awakePeople.length === 0) {
            return;
        }

        this.location.asleepPeopleCount = this.location.characters.length - this.location.awakePeople.length;

        _.forEach(this.location.awakePeople, (awakePerson) => {
            const locationPerson = _.find(this.location.characters, (person) => (person.id === awakePerson.id));
            locationPerson.isAwake = true;
        });
    }

    public toggleShowSleepers() {
        this.location.display.isShowingSleepers = !this.location.display.isShowingSleepers;
    }

    public toggleShowItems() {
        this.location.display.isShowingItems = !this.location.display.isShowingItems;
    }

    public showTab(tab) {
        this.location.display.tabs.isShowingItems = false;
        this.location.display.tabs.isShowingPeople = false;
        this.location.display.tabs.isShowingActivities = false;

        this.location.display.tabs[tab] = true;
    }

    public collect(item) {
        const amountPrompt = new Prompt('How much of this resource do you want to pick up?');

        amountPrompt
            .answerStream
            .subscribe((amount) => {
                amount = Number(amount);

                if (amount < 1) {
                    return;
                }

                this.zoneService
                    .pickUp(item.id, amount)
                    .subscribe((response) => {
                        console.log('response', response);
                    });
            });

        this.promptStream.next(amountPrompt);
    }

    public talk($event, targetCharacter) {
        const speechPrompt = new Prompt(`To ${targetCharacter.name}`);

        speechPrompt
            .answerStream
            .subscribe((message) => {
                this.messagesService
                    .sendCharacterMessage(message, this.character, targetCharacter)
                    .subscribe((response) => {
                        console.log('resposne: ', response);
                    });
            });

        this.promptStream.next(speechPrompt);
    }

    public give(targetCharacter) {
        this.characterService
            .getInventory()
            .subscribe((items: any[]) => {
                items.forEach((item) => {
                    const itemOption = new Option(`${item.name}: ${item.description}`);

                    itemOption
                        .selectedStream
                        .subscribe(() => {
                            const amountPrompt = new Prompt('How much of this resource do you want to give?');

                            amountPrompt
                                .answerStream
                                .subscribe((amount) => {
                                    amount = Number(amount);

                                    if (amount < 1 || amount > item.count) {
                                        return;
                                    }

                                    this.characterService
                                        .giveItem(item.id, amount, targetCharacter.id)
                                        .subscribe((response) => {
                                            console.log('response', response);
                                        });
                                });

                            this.promptStream.next(amountPrompt);
                        });

                    this.optionsStream.next(itemOption);
                });
            });
    }

    public point(targetCharacter) {
        this.characterService
            .pointAt(targetCharacter.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }

    public attack(targetCharacter) {
        this.characterService
            .attack(targetCharacter.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }
}
