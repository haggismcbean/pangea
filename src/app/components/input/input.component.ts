import { Component, OnInit, OnChanges, HostListener, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Option } from '../../actions/option.model';
import { Prompt } from '../../actions/prompt.model';

import { InputText } from './models/input-text.model';
import { Selection } from './models/selection.model';
import { HintedOption } from './models/hinted-option.model';

@Component({
    selector: 'pan-input',
    templateUrl: 'input.component.html',
    styleUrls: [
        './input.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements OnInit, OnChanges {
    @Input() public options: Option[] = [];
    @Input() public prompt: Prompt;
    @Input() public originalOptions: Option[] = [];
    @Input() public panelStream;

    public currentOptions: Option[];
    public hintedOption: HintedOption;

    public selection: Selection;
    public input: InputText;
    // public promptText: PromptText;
    // public keysMap: KeyMap;
    // public optionTree: OptionTree;
    // public hintedOption: HintedOption;

    public promptText = '';
    public hint;

    private keysMap = {};
    private optionsTree = [];
    private currentOptionSuggestion = null;

    private promptMode = {
        handleEnter: this.handlePromptEnter.bind(this),
        handleBackspace: this.handleBackspace.bind(this),
        handleTab: _.noop,
        handleInput: this.handleInput.bind(this),
        handleEscape: this.handleEscape.bind(this)
    };

    private optionsMode = {
        handleEnter: this.handleOptionsEnter.bind(this),
        handleBackspace: this.handleOptionsBackspace.bind(this),
        handleTab: this.handleOptionsTab.bind(this),
        handleInput: this.handleOptionsInput.bind(this),
        handleEscape: this.handleEscape.bind(this)
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

    constructor() {
        this.selection = new Selection();
        this.input = new InputText('', this.selection);
    }

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

    public onOptionClicked(option: Option) {
        if (option.options && option.options.length > 0) {
            this.currentOptions = option.options;
            return;
        }

        const clippedInput = this.getAccountedForInput(this.input.rawInput);

        option
            .selectedStream
            .next(clippedInput);

        this.currentOptions = undefined;

        this.resetInput();
    }

    private handleKeypress(keyboardEvent: KeyboardEvent) {
        this.keysMap[keyboardEvent.key] = keyboardEvent.type === 'keydown';

        if (this.keysMap['Meta'] && this.keysMap['m'] || this.keysMap['Control'] && this.keysMap['m']) {
            keyboardEvent.preventDefault();
            return;
        }

        if (keyboardEvent.type === 'keyup') {
            return;
        }

        // if user presses other special character
        if (keyboardEvent.key === 'Shift' || keyboardEvent.key === 'Meta' || keyboardEvent.key === 'Control') {
            return;
        } else if (keyboardEvent.key === 'Alt') {
            keyboardEvent.preventDefault();
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
            keyboardEvent.preventDefault();
            this.mode.handleTab();
            return;
        }

        // if user presses escape
        if (keyboardEvent.key === 'Escape') {
            keyboardEvent.preventDefault();
            this.mode.handleEscape();
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
        const inputLength = this.input.rawInput.length;
        this.input.deleteText(inputLength - 1, inputLength);
        this.selection.selectEnd(this.input.rawInput);
    }

    private resetOptions() {
        if (_.last(this.optionsTree) && this.input.rawInput.indexOf(_.last(this.optionsTree).name) === -1) {
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
        const clippedInput = this.getAccountedForInput(this.input.rawInput);
        _.replace(this.input.rawInput, clippedInput, '');

        const selectedOption = _.last(this.optionsTree);

        if (selectedOption && this.isEndNode(selectedOption)) {
            selectedOption
                .selectedStream
                .next(clippedInput);

            this.currentOptions = undefined;
            this.resetInput();
        } else {
            this.currentOptions = this.options;
            this.input.deleteText();
            this.hint = '';
        }
    }

    private handlePromptEnter() {
        this.prompt
            .answerStream
            .next(this.input);

        this.prompt = undefined;
        this.input.deleteText();
        this.promptText = '';
    }

    /////////////
    // Tab

    private handleOptionsTab() {
        if (this.hint) {
            this.input.addText(this.hint + ' ');
            this.hint = '';
            this.optionsTree.push(this.hintedOption);
            this.currentOptions = this.hintedOption.options;
            this.hintedOption = undefined;
        }
    }

    /////////////
    // Escape

    private handleEscape() {
        this.resetInput();

        this.promptText = '';
        this.hintedOption = null;

        this.optionsTree = [];
        this.currentOptionSuggestion = null;

        this.mode = this.optionsMode;
        this.currentOptions = this.originalOptions;

        this.panelStream.next('');
    }

    /////////////
    // Any other key

    private handleOptionsInput(keyboardEvent: KeyboardEvent) {
        this.handleInput(keyboardEvent);

        if (this.currentOptions) {
            const _hintedOption = this.getHintedOption(this.currentOptions, this.input.rawInput);
            
            if (_hintedOption) {
                this.hintedOption = new HintedOption(_hintedOption);
            }
        }

        if (this.hintedOption) {
            this.hint = this.hintedOption.calculateHintText(this.getAccountedForInput(this.input.rawInput));
            this.input.addText(this.hint);

            const selectionStart = this.input.rawInput.length - this.hint.length;
            this.selection.select(selectionStart);

            this.input.calculateHtmlInput();
        } else {
            this.hint = '';
        }
    }

    private handleInput(keyboardEvent: KeyboardEvent) {
        this.input.deleteText(this.selection.start, this.selection.end);
        this.input.addText(keyboardEvent.key);
        this.selection.selectEnd(this.input.rawInput);
    }

    private getHintedOption(options: Option[], input: string): Option {
        const clippedInput = this.getAccountedForInput(input);
        const option = _.find(options, function(_option) {
            return _.startsWith(_option.name, clippedInput);
        });

        return option;
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

    private isEndNode(option) {
        return !option.options || option.options.length === 0;
    }

    private resetInput() {
        this.input.deleteText();
        this.hint = '';
        this.promptText = '';
        this.optionsTree = [];
        this.hintedOption = undefined;
    }
}
