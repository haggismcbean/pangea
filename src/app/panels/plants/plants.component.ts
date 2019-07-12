import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'pan-plants',
    templateUrl: './plants.component.html',
    styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        console.log('hi');
    }
}
