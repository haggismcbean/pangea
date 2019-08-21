import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { ZoneService } from '../../services/zone.service';
import { MineService } from '../../services/mine.service';
import { FarmService } from '../../services/farm.service';
import { WebSocketService } from '../../services/web-socket.service';
import { MessagesService } from '../../services/messages.service';
import { CharacterService } from '../../services/character.service';

import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';

import { Message } from '../../models/message.model';
import { Character } from '../../models/character.model';

import { getWeatherGlyph } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    @Input() public mainFeedStream;
    @Input() public promptStream;
    @Input() public optionsStream;

    public character: Character;

    public location = {
        name: '',
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
        },
        borders: {
            childZones: [],
            siblingZones: {}
        }
    };

    public weatherGlyph;

    constructor(
        private zoneService: ZoneService,
        private farmService: FarmService,
        private mineService: MineService,
        private webSocketService: WebSocketService,
        private messagesService: MessagesService,
        private characterService: CharacterService
    ) {}

    ngOnInit() {
        this.character = this.characterService.getCurrent();

        this.zoneService
            .getZoneInventory(this.character.zoneId)
            .subscribe((items: any[]) => {
                this.location.items = items;
            });

        this.zoneService
            .getActivities(this.character.zoneId)
            .subscribe((activities) => {
                _.forEach(activities, (activity) => {

                    _.forEach(activity.requiredIngredients, (requiredIngredient) => {

                        const suppliedIngredient = this.findSuppliedIngredient(activity, requiredIngredient);
                        requiredIngredient.supply = suppliedIngredient;
                    });
                });

                this.location.activities = activities;

            });

        const getZoneDescription = this.zoneService
            .getDescription(this.character.zoneId);

        const getZoneUsers = this.webSocketService
            .zoneUsersStream;

        const getZoneBorders = this.zoneService
            .getBorderingZones(this.character.zoneId);

        combineLatest(getZoneDescription, getZoneUsers, getZoneBorders)
            .subscribe((results) => {
                const location = results[0];
                const awakePeople = results[1];
                const borders = results[2];

                this.setLocation(location);
                this.setWeather(location);
                this.setBorders(borders);

                this.location.awakePeople = awakePeople;
                this.assignWakers();
            });
    }

    private findSuppliedIngredient(activity, requiredIngredient) {
        return _.find(activity.ingredients, (suppliedIngredient) => {
            if (suppliedIngredient.type === requiredIngredient.type) {
                return true;
            }

            if (suppliedIngredient.item_id === requiredIngredient.item_id) {
                return true;
            }
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

    private setBorders(borders) {
        this.location.borders = borders;
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

    public toggleShowItems() {
        this.location.display.isShowingItems = !this.location.display.isShowingItems;
    }

    public showTab(tab) {
        this.location.display.tabs.isShowingItems = false;
        this.location.display.tabs.isShowingPeople = false;
        this.location.display.tabs.isShowingActivities = false;

        this.location.display.tabs[tab] = true;
    }

    public name(zone) {
        const namePrompt = new Prompt('Enter name');

        namePrompt
            .answerStream
            .subscribe((name: string) => {
                console.log('name? ', name);
                if (!name) {
                    return;
                }

                this.zoneService
                    .name(zone.id, name)
                    .subscribe(() => {
                        zone.customName = name;
                    });
            });

        this.promptStream.next(namePrompt);
    }

    public moveTo(zone) {
        this.zoneService
            .changeZones(zone.id)
            .subscribe((response) => {
                const resetMessage = new Message(0);
                resetMessage.class = 'reset';
            });
    }

    public createMine() {
        this.mineService
            .createMine()
            .subscribe((mineActivity) => {
                this.onActivityCreated(mineActivity);
            });
    }

    public createFarm() {
        this.farmService
            .createPlot(5)
            .subscribe((farmActivity) => {
                this.onActivityCreated(farmActivity);
            });
    }

    public explore() {
        this.zoneService
            .explore(this.character.zoneId)
            .subscribe((exploreActivity) => {
                this.onActivityCreated(exploreActivity);
            });
    }

    private onActivityCreated(activity) {
        if (activity.progress === 100) {
            const resetMessage = new Message(0);
            resetMessage.class = 'reset';

            this.mainFeedStream
                .next(resetMessage);
        } else {
            const cancelActivityOption = new Option('cancel');

            cancelActivityOption
                .selectedStream
                .subscribe(() => this.cancelActivity(activity));

            this.optionsStream.next(cancelActivityOption);
        }
    }

    private cancelActivity(activity) {
        this.characterService
            .cancelActivity(activity.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }
}
