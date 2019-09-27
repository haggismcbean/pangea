import { Component, OnInit, OnChanges, HostListener, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Option } from '../../actions/option.model';
import { Prompt } from '../../actions/prompt.model';

import { InputText } from './models/input-text.model';
import { Selection } from './models/selection.model';
import { HintedOption } from './models/hinted-option.model';
import { OptionsTree } from './models/options-tree.model';
import { KeysMap } from './models/keys-map.model';

import { OptionsMode } from './models/modes/options-mode.model';
import { PromptMode } from './models/modes/prompt-mode.model';

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

    public selection: Selection;
    public inputText: InputText;
    public optionsTree: OptionsTree;
    public hintedOption: HintedOption;
    // public promptText: PromptText;
    public keysMap: KeysMap;

    public promptText = '';

    private currentMode;
    private promptMode: PromptMode;
    private optionsMode: OptionsMode;

    private isMouseDown: boolean = false;
    private selectionStart: number;

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
        this.selection = new Selection();
        this.inputText = new InputText('', this.selection);
        this.optionsTree = new OptionsTree(this.options);

        this.promptMode = new PromptMode(this.inputText, this.selection);
        this.initPromptMode();

        this.optionsMode = new OptionsMode(this.inputText, this.selection);
        this.initOptionsMode();

        this.currentMode = this.promptMode;

        this.keysMap = new KeysMap(this.currentMode, this.reset.bind(this));
    }

    private initOptionsMode() {
        this.optionsMode.setOptionsTree(this.optionsTree);
        this.optionsMode.setOptions(this.options);
        this.optionsMode.setOriginalOptions(this.originalOptions);
        this.optionsMode.setPanelStream(this.panelStream);
    }

    private initPromptMode() {
        this.promptMode.setPrompt(this.prompt);
        this.promptMode.setPanelStream(this.panelStream);
    }

    public ngOnChanges(changes) {
        if (!this.currentMode) {
            return;
        }

        if (changes.prompt && changes.prompt.currentValue) {
            this.promptText = changes.prompt.currentValue.name;
            console.log('what, and again or sometihng? ', this.promptText);
            this.promptMode.setPrompt(changes.prompt.currentValue);
            this.currentMode = this.promptMode;
        } else {
            this.currentMode = this.optionsMode;
        }

        if (changes.options && changes.options.currentValue && changes.options.currentValue.length > 0) {
            this.currentMode = this.optionsMode;
            this.optionsMode.setOptions(this.options);
            this.optionsMode.setOriginalOptions(this.options);
        }

        this.keysMap = new KeysMap(this.currentMode, this.reset.bind(this));
    }

    public onOptionClicked(option: Option) {
        if (option.options && option.options.length > 0) {
            this.optionsMode.setOptions(option.options);
            return;
        }

        option
            .selectedStream
            .next();

        this.currentMode.resetInput();
    }

    private handleKeypress(keyboardEvent: KeyboardEvent) {
        this.keysMap.handleKeypress(keyboardEvent);
    }

    private reset() {
        this.promptText = '';
        this.currentMode = this.optionsMode;
        this.keysMap = new KeysMap(this.currentMode, this.reset.bind(this));
    }

    public mousedown($event) {
        if (!this.inputText) {
            return;
        }

        this.isMouseDown = true;

        const selectedElementClassName = _.first($event.path).className;
        this.selectionStart = parseInt(selectedElementClassName.replace('pangeana__input-position-', ''));

        this.selection.select(this.selectionStart, this.selectionStart + 1);
        this.inputText.calculateHtmlInput();
    }

    public mousemove($event) {
        if (!this.isMouseDown) {
            return;
        }

        const selectedElementClassName = _.first($event.path).className;
        const selectionPosition = parseInt(selectedElementClassName.replace('pangeana__input-position-', ''));
    
        if (selectionPosition > this.selectionStart) {
            this.selection.select(this.selectionStart, selectionPosition);
        }

        if (selectionPosition < this.selectionStart) {
            this.selection.select(selectionPosition, this.selectionStart);
        }

        this.inputText.calculateHtmlInput();
    }

    public mouseup() {
        this.isMouseDown = false;

    }
}
