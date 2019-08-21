import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { ZoneService } from '../../services/zone.service';
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
        name: "",
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

                console.log('activities: ', activities);

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

                console.log('location: ', this.location);
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
}
