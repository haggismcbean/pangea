import { Component, OnInit, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Option } from './models/option.model';

@Component({
    selector: 'pan-input',
    templateUrl: 'input.component.html',
    styleUrls: [
        './input.component.scss',
    ],
})
export class InputComponent implements OnInit {
    public options: Option[] = [];
    public currentOptions: Option[] = this.options;
    public input = '';

    private caretPosition = 0;
    private optionsTree = [];
    private currentOptionSuggestion = null;

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        // event.preventDefault();
        this.handleKeypress(event);
    }

    constructor() {}

    public ngOnInit() {
        // this.hints.push({
        //     option: 'looks at',
        //     options: [
        //         {
        //             option: 'people',
        //             options: [{
        //                 option: 'george'
        //             }, {
        //                 option: 'phil'
        //             }, {
        //                 option: 'bob'
        //             }]
        //         }
        //     ]
        // });
        const interacts = this.getInteractOptions();
        this.options.push(interacts);

        const movesTo = this.getMovesToOptions();
        this.options.push(movesTo);

        // this.hints.push({
        //     option: 'names',
        //     examples: [
        //         'zone',
        //         'person',
        //         'animal species',
        //         'plant species',
        //     ]
        // });

        // this.hints.push({
        //     option: 'inventory',
        //     examples: []
        // });

        // this.hints.push({
        //     option: 'does',
        //     examples: [
        //         'cooking',
        //         'crafting',
        //         'forging',
        //         'eating',
        //         'building'
        //     ]
        // });

        // this.hints.push({
        //     option: 'puts',
        //     examples: [
        //         'in bag',
        //         'down',
        //         'onto',
        //         'in hands of',
        //     ]
        // });

        // this.hints.push({
        //     option: 'attacks',
        //     examples: [
        //         'person',
        //         'animal',
        //     ]
        // });
    }

    private getInteractOptions() {
        const interacts = new Option('interacts');
        // TODO - add all the people in the location
        //
        // const with = new Option('with');
        // const bob = new Option('bob');
        // with.addOptions([bob]);
        //
        const loudly = new Option('loudly');

        interacts.setOptions([loudly]);

        return interacts;
    }

    private getMovesToOptions() {
        const movesTo = new Option('moves to');
        // TODO - add zones baby!
        //
        const north = new Option('north');
        const south = new Option('south');
        const east = new Option('east');
        const west = new Option('west');

        movesTo.setOptions([north, south, east, west]);

        return movesTo;
    }

    private handleKeypress(keyboardEvent: KeyboardEvent) {
        // if user presses delete
        if (keyboardEvent.key === 'Backspace') {
            event.preventDefault();
            this.handleBackspace();
            return;
        }

        // if user presses enter
        if (keyboardEvent.key === 'Enter') {
            event.preventDefault();
            // this.handleEnter(event);
            return;
        }

        // if user presses tab
        if (keyboardEvent.key === 'Tab') {
            event.preventDefault();
            this.completeSuggestion();
            return;
        }

        // if user presses left
        if (keyboardEvent.key === 'ArrowLeft') {
            event.preventDefault();
            return;
        }

        // if user presses right
        if (keyboardEvent.key === 'ArrowRight') {
            event.preventDefault();
            return;
        }

        // if user presses other special character
        if (keyboardEvent.key === 'Shift' || keyboardEvent.key === 'Meta' || keyboardEvent.key === 'Control') {
            return;
        }

        // otherwise
        event.preventDefault();
        this.handleInput(keyboardEvent);
    }

    private handleBackspace() {
        this.input = this.input.slice(0, this.caretPosition - 1);
        this.hint = '';
        this.caretPosition--;

        if (_.last(this.optionsTree) && this.input.indexOf(_.last(this.optionsTree).name) === -1) {
            this.optionsTree.pop();

            if (this.optionsTree.length === 0) {
                this.currentOptions = this.options;
            } else {
                this.currentOptions = _.last(this.optionsTree).options;
            }
        }
    }

    private handleInput(keyboardEvent: KeyboardEvent) {
        this.input += event.key;
        this.caretPosition++;

        if (this.currentOptions) {
            this.hintedOption = this.getHintedOption(this.currentOptions, this.input);
        }

        if (this.hintedOption) {
            this.hint = this.getHint(this.hintedOption, this.input);
        }
    }

    private getHintedOption(options: Option[], input: string): Option {
        const input = this.getAccountedForInput(input);
        const option = _.find(options, function(_option) {
            return _.startsWith(_option.name, input);
        });

        return option;
    }

    private getHint(option: Option, input: string): string {
        const input = this.getAccountedForInput(input);
        return _.replace(option.name, input, '');
    }

    private getAccountedForInput(input: string): string {
        let accountedForInput = '';

        for (let i = 0; i < this.optionsTree.length; i++) {
            accountedForInput += this.optionsTree[i].name + ' ';
        }

        return _.replace(input, accountedForInput, '');
    }

    private completeSuggestion() {
        if (this.hint) {
            this.input += this.hint + ' ';
            this.hint = '';
            this.caretPosition = this.input.length;
            this.optionsTree.push(this.hintedOption);
            this.currentOptions = this.hintedOption.options;
        }
    }
}
