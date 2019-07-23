import { Component, OnInit, Input } from '@angular/core';

import { ZoneService } from '../../services/zone.service';

import { Character } from '../../models/character.model';

import { weather } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    @Input() public character: Character;

    public description;
    public weatherGlyph;

    constructor(
        private zoneService: ZoneService
    ) {
        console.log('uh oh');
    }

    ngOnInit() {
        console.log('hi');

        this.zoneService
            .getZoneInventory(this.character.zoneId)
            .subscribe((items: any[]) => {
                console.log('zone inventory: ', items);
            });

        this.zoneService
            .getDescription(this.character.zoneId)
            .subscribe((location) => {
                this.description = location.description;

                this.weatherGlyph = weather.THUNDER_STORMS;
            });
    }
}
