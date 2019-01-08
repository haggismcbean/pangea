import { Component, OnInit, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import * from 'lodash';

@Component({
    selector: 'pan-input',
    templateUrl: 'input.component.html',
    styleUrls: [
        './input.component.scss',
    ],
})
export class InputComponent implements OnInit {
    public hints: any[] = [];
    public input = '';

    private caretPosition = 0;

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        this.handleKeypress(event);
      // event.key === 'ArrowUp'
    }

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

    private handleKeypress(keyboardEvent: KeyboardEvent) {
        // if user presses delete
        if (keyboardEvent.key === 'Backspace') {
            this.handleBackspace();
            return;
        }

        // if user presses enter
        if (keyboardEvent.key === 'Enter') {
            // this.handleEnter(event);
            return;
        }

        // if user presses tab
        if (keyboardEvent.key === 'Tab') {
            this.completeSuggestion();
            return;
        }

        // if user presses left
        if (keyboardEvent.key === 'ArrowLeft') {
            return;
        }

        // if user presses right
        if (keyboardEvent.key === 'ArrowRight') {
            return;
        }

        // if user presses other special character
        if (keyboardEvent.key === 'Shift' || keyboardEvent.key === 'Meta' || keyboardEvent.key === 'Control') {
            return;
        }

        // otherwise
        this.handleInput(keyboardEvent);
    }

    private handleBackspace() {
        this.input = this.input.slice(0, this.caretPosition - 1);
        this.caretPosition--;
    }

    private handleInput(keyboardEvent: KeyboardEvent) {
        this.input += event.key;
        this.caretPosition++;

        this.suggestion = this.getSuggestion(this.input);
    }

    private getSuggestion(input: string) {
        const hint = _.find(this.hints, function(hint) {
            return _.startsWith(input, hint.option);
        });

        if (hint) {
            // TODO = implement this bit!
        } else {
            const suggestion = _.find(this.hints, function(hint) {
                return _.startsWith(hint.option, input);
            });
        }

        if (!suggestion) {
            return '';
        }

        return _.replace(suggestion.option, input, '');
    }

    private completeSuggestion() {
        this.input += this.suggestion;
        this.suggestion = '';
        this.caretPosition = this.input.length;
    }
}
