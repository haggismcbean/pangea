import { Component } from '@angular/core';

import { CLOUDY, FOGGY, HEAVY_RAIN } from './constants/weather';

import hljs from 'highlight.js/lib/highlight';

@Component({
    selector: 'pan-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent {

    public weatherGlyph;

    constructor() {
        const weatherHighlighting = {
            case_insensitive: true,
            keywords: {
                grey: '- _',
                blue: 'ʻ ‚',
            },
            contains: []
        };

        hljs.registerLanguage('weather', () => weatherHighlighting);
        this.weatherGlyph = hljs.highlight('weather', FOGGY);
        console.log(this.weatherGlyph);
    }
}
