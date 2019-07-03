import { Component, OnInit } from '@angular/core';

import { weather } from './constants/weather';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

    public weatherGlyph;

    constructor() {
    }

    ngOnInit() {
    	console.log(weather);
        this.weatherGlyph = weather.THUNDER_STORMS;
        console.log(this.weatherGlyph);
    }
}
