import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { ZoneService } from '../../services/zone.service';
import { WebSocketService } from '../../services/web-socket.service';

import { Character } from '../../models/character.model';

import { getWeatherGlyph } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    @Input() public character: Character;

    public location = {
        characters: [],
        awakePeople: [],
        items: [],
        display: {
            isShowingSleepers: false,
            isShowingItems: false
        }
    };

    public weatherGlyph;

    constructor(
        private zoneService: ZoneService,
        private webSocketService: WebSocketService
    ) {}

    ngOnInit() {
        this.zoneService
            .getZoneInventory(this.character.zoneId)
            .subscribe((items: any[]) => {
                console.log('zone inventory: ', items);
                this.location.items = items;
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

        this.asleepPeopleCount = this.location.characters.length - this.location.awakePeople.length;

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
}
