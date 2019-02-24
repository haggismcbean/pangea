import { Component, OnInit, OnChanges, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Option } from '../../actions/option.model';
import { Prompt } from '../../actions/prompt.model';

@Component({
    selector: 'pan-input',
    templateUrl: 'input.component.html',
    styleUrls: [
        './input.component.scss',
    ],
})
export class InputComponent implements OnInit, OnChanges {
    @Input() public options: Option[] = [];
    @Input() public prompt: Prompt;

    public currentOptions: Option[];
    public input = '';
    public hint = '';
    public promptText = '';
    public hintedOption: Option;

    private keysMap = {};

    private caretPosition = 0;
    private optionsTree = [];
    private currentOptionSuggestion = null;

    private promptMode = {
        handleEnter: this.handlePromptEnter.bind(this),
        handleBackspace: this.handleBackspace.bind(this),
        handleTab: _.noop,
        handleInput: this.handleInput.bind(this)
    };

    private optionsMode = {
        handleEnter: this.handleOptionsEnter.bind(this),
        handleBackspace: this.handleOptionsBackspace.bind(this),
        handleTab: this.handleOptionsTab.bind(this),
        handleInput: this.handleOptionsInput.bind(this)
    };

    private mode = this.optionsMode;

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.handleKeypress(event);
    }

    @HostListener('window:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent) {
        this.handleKeypress(event);
    }

    constructor() {}

    public ngOnInit() {
        this.currentOptions = this.options;
    }

    public ngOnChanges(changes) {
        if (changes.prompt && changes.prompt.currentValue) {
            this.promptText = changes.prompt.currentValue.name;
            this.mode = this.promptMode;
        } else {
            this.mode = this.optionsMode;
        }

        if (changes.options && changes.options.currentValue && changes.options.currentValue.length > 0) {
            this.mode = this.optionsMode;
            this.currentOptions = this.options;
        }
    }

    private handleKeypress(keyboardEvent: KeyboardEvent) {
        this.keysMap[keyboardEvent.key] = keyboardEvent.type === 'keydown';

        if (this.keysMap['Meta'] && this.keysMap['m'] || this.keysMap['Control'] && this.keysMap['m']) {
            keyboardEvent.preventDefault();
            return;
        }

        if (keyboardEvent.type === 'keydown') {
            return;
        }

        // if user presses other special character
        if (keyboardEvent.key === 'Shift' || keyboardEvent.key === 'Meta' || keyboardEvent.key === 'Control') {
            return;
        } else {
            keyboardEvent.preventDefault();
        }

        // if user presses delete
        if (keyboardEvent.key === 'Backspace') {
            this.mode.handleBackspace();
            return;
        }

        // if user presses enter
        if (keyboardEvent.key === 'Enter') {
            this.mode.handleEnter();
            return;
        }

        // if user presses tab
        if (keyboardEvent.key === 'Tab') {
            this.mode.handleTab();
            return;
        }

        // if user presses left
        if (keyboardEvent.key === 'ArrowLeft' || keyboardEvent.key === 'ArrowRight') {
            // TODO
            return;
        }

        // otherwise
        this.mode.handleInput(keyboardEvent);
    }


    /////////////
    // Backspace

    private handleOptionsBackspace() {
        this.handleBackspace();
        this.resetOptions();
    }

    private handleBackspace() {
        this.input = this.input.slice(0, this.caretPosition - 1);
        this.hint = '';
        this.caretPosition--;
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
    // Enter

    private handleOptionsEnter() {
        const clippedInput = this.getAccountedForInput(this.input);
        _.replace(this.input, clippedInput, '');

        const selectedOption = _.last(this.optionsTree);

        if (selectedOption) {
            selectedOption
                .selectedStream
                .next(clippedInput);

            this.currentOptions = undefined;
        } else {
            this.currentOptions = this.options;
        }

        this.input = '';
        this.hint = '';
        this.caretPosition = this.input.length;
        this.optionsTree = [];
        this.hintedOption = undefined;
    }

    private handlePromptEnter() {
        this.prompt
            .answerStream
            .next(this.input);

        this.prompt = undefined;
        this.input = '';
        this.promptText = '';
        this.caretPosition = this.input.length;
    }

    /////////////
    // Tab

    private handleOptionsTab() {
        if (this.hint) {
            this.input += this.hint + ' ';
            this.hint = '';
            this.caretPosition = this.input.length;
            this.optionsTree.push(this.hintedOption);
            this.currentOptions = this.hintedOption.options;
            this.hintedOption = undefined;
        }
    }

    /////////////
    // Any other key

    private handleOptionsInput(keyboardEvent: KeyboardEvent) {
        this.handleInput(keyboardEvent);

        if (this.currentOptions) {
            this.hintedOption = this.getHintedOption(this.currentOptions, this.input);
        }

        if (this.hintedOption) {
            this.hint = this.getHint(this.hintedOption, this.input);
        } else {
            this.hint = '';
        }
    }

    private handleInput(keyboardEvent: KeyboardEvent) {
        this.input += keyboardEvent.key;
        this.caretPosition++;
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

    ////////////
    // Utility

    private getAccountedForInput(input: string): string {
        let accountedForInput = '';

        for (let i = 0; i < this.optionsTree.length; i++) {
            accountedForInput += this.optionsTree[i].name + ' ';
        }

        return _.replace(input, accountedForInput, '');
    }
}
