import { Component, OnInit, Input } from '@angular/core';

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
        people: undefined
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
                console.log('location: ', location);
                // QUESTION - am I creating a new character each time i log in?
                this.location = location;

                this.weatherGlyph = getWeatherGlyph({
                    temperature: location.current_temperature,
                    rainfall: location.current_rainfall,
                });
            });

        this.webSocketService
            .zoneUsersStream
            .subscribe((people) => {
                console.log('zone people: ', people);
                // this is just the awake ones
                this.location.people = people;

                // need the sleeping ones too!
            });
    }
}
