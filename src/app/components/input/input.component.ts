import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'pan-input',
    templateUrl: 'input.component.html',
    styleUrls: [
        './input.component.scss',
    ],
})
export class InputComponent implements OnInit {
    public hints: any[] = [];
    public input: string;

    constructor() {}

    public ngOnInit() {
        this.hints.push({
            option: 'looks at',
            examples: [
                'people',
                'plants',
                'animals',
                'tools',
                'surroundings'
            ]
        });

        this.hints.push({
            option: 'interacts',
            examples: [
                'with',
                'loudly',
            ]
        });

        this.hints.push({
            option: 'moves to',
            examples: [
                'north',
                'south',
                'east',
                'west',
            ]
        });

        this.hints.push({
            option: 'names',
            examples: [
                'zone',
                'person',
                'animal species',
                'plant species',
            ]
        });

        this.hints.push({
            option: 'inventory',
            examples: []
        });

        this.hints.push({
            option: 'does',
            examples: [
                'cooking',
                'crafting',
                'forging',
                'eating',
                'building'
            ]
        });

        this.hints.push({
            option: 'puts',
            examples: [
                'in bag',
                'down',
                'onto',
                'in hands of',
            ]
        });

        this.hints.push({
            option: 'attacks',
            examples: [
                'person',
                'animal',
            ]
        });
    }

    public onInputChange(event: any) {
        event.preventDefault();
        console.log(event);
        // so we need to alter the options shown to reduce based on what's available

        // then when its been chosen, 
    }
}
