import { Component } from '@angular/core';

import { CLOUDY, FOGGY, HEAVY_RAIN } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent {
    constructor() {
        this.weatherGlyph = FOGGY;
    }
}
