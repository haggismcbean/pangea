import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

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
        awakePeople: []
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
            });

        this.zoneService
            .getDescription(this.character.zoneId)
            .subscribe((location) => {
                console.log(location);
                // QUESTION - am I creating a new character each time i log in?
                this.location = _.assign(this.location, location);

                this.weatherGlyph = getWeatherGlyph({
                    temperature: location.current_temperature,
                    rainfall: location.current_rainfall,
                });

                this.assignWakers();
            });

        this.webSocketService
            .zoneUsersStream
            .subscribe((people) => {
                // this is just the awake ones
                this.location.awakePeople = people;
                this.assignWakers();
                console.log('awake people: ', this.location.awakePeople);

                // need the sleeping ones too!
            });
    }

    private assignWakers() {
        if (this.location.characters.length === 0 || this.location.awakePeople.length === 0) {
            return;
        }

        _.forEach(this.location.awakePeople, (awakePerson) => {
            const locationPerson = _.find(this.location.characters, (person) => (person.id === awakePerson.id));
            locationPerson.isAwake = true;
        });
    }
}
