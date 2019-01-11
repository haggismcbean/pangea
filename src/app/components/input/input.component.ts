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
    @Input() public options: Option[] = [];

    public currentOptions: Option[];
    public input = '';
    public hint = '';
    public hintedOption: Option;

    private caretPosition = 0;
    private optionsTree = [];
    private currentOptionSuggestion = null;

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.handleKeypress(event);
    }

    constructor() {}

    public ngOnInit() {
        this.currentOptions = this.options;
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

    /////////////
    // Backspace

    private handleBackspace() {
        this.input = this.input.slice(0, this.caretPosition - 1);
        this.hint = '';
        this.caretPosition--;

        this.resetOptions();
    }

    private resetOptions() {
        if (_.last(this.optionsTree) && this.input.indexOf(_.last(this.optionsTree).name) === -1) {
            this.optionsTree.pop();

            if (this.optionsTree.length === 0) {
                this.currentOptions = this.options;
            } else {
                this.currentOptions = _.last(this.optionsTree).options;
            }
        }
    }

    /////////////
    // Any other key

    private handleInput(keyboardEvent: KeyboardEvent) {
        this.input += keyboardEvent.key;
        this.caretPosition++;

        if (this.currentOptions) {
            this.hintedOption = this.getHintedOption(this.currentOptions, this.input);
        }

        if (this.hintedOption) {
            this.hint = this.getHint(this.hintedOption, this.input);
        } else {
            this.hint = '';
        }
    }

    private getHintedOption(options: Option[], input: string): Option {
        const clippedInput = this.getAccountedForInput(input);
        const option = _.find(options, function(_option) {
            return _.startsWith(_option.name, clippedInput);
        });

        return option;
    }

    private getHint(option: Option, input: string): string {
        const clippedInput = this.getAccountedForInput(input);
        return _.replace(option.name, clippedInput, '');
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
