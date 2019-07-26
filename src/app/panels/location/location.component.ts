import { Component, OnInit, Input } from '@angular/core';

import { ZoneService } from '../../services/zone.service';

import { Character } from '../../models/character.model';

import { getWeatherGlyph } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    @Input() public character: Character;

    public location = {};
    public weatherGlyph;

    constructor(
        private zoneService: ZoneService
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
                this.location = location;

                this.weatherGlyph = getWeatherGlyph({
                    temperature: location.current_temperature,
                    rainfall: location.current_rainfall,
                });
            });
    }
}
