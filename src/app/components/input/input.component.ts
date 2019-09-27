import { Component, OnInit, OnChanges, HostListener, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, filter, buffer } from 'rxjs/operators';

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

    private clickStream$;
    private buffer$;
    private doubleClick$;
    private tripleClick$;

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

        this.initClickStreams();
        this.watchDoubleClick();
        this.watchTripleClick();
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

    private initClickStreams() {
        this.clickStream$ = new Subject();

        this.buffer$ = this.clickStream$.pipe(
            debounceTime(250)
        );

        this.doubleClick$ = this.clickStream$.pipe(
            buffer(this.buffer$),
            map((list: any) => {
                return list.length;
            }),
            filter(x => x === 2),
        );

        this.tripleClick$ = this.clickStream$.pipe(
            buffer(this.buffer$),
            map((list: any) => {
                return list.length;
            }),
            filter(x => x === 3),
        );
    }

    public ngOnChanges(changes) {
        if (!this.currentMode) {
            return;
        }

        if (changes.prompt && changes.prompt.currentValue) {
            this.promptText = changes.prompt.currentValue.name;
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
        $event.preventDefault();
        if (!this.inputText) {
            return;
        }

        this.clickStream$.next();

        this.isMouseDown = true;

        const selectedElementClassName = _.first($event.path).className;
        this.selectionStart = parseInt(selectedElementClassName.replace('pangeana__input-position-', ''));

        this.selection.select(this.selectionStart, this.selectionStart + 1);
        this.inputText.calculateHtmlInput();
    }

    public mousemove($event) {
        $event.preventDefault();
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

    public mouseup($event) {
        $event.preventDefault();
        this.isMouseDown = false;
    }

    private watchDoubleClick() {
        this.doubleClick$
        .subscribe(() => {
            // highlight currently selected word
            if (this.inputText.rawInput[this.selection.start] === ' ') {
                return;
            }

            const words = this.inputText.rawInput.split(' ');

            let letterCount = 0;
            let clickedWord;
            let firstLetter = 0;
            let lastLetter = 0;

            _.forEach(words, (word) => {
                if (letterCount > this.selection.start) {
                    return;
                }

                letterCount += word.length + 1;

                if (letterCount > this.selection.start) {
                    clickedWord = word;
                    firstLetter = letterCount - word.length - 1;
                    lastLetter = letterCount - 1;
                }
            });

            this.selection.select(firstLetter, lastLetter);
            this.inputText.calculateHtmlInput();
        });
    }

    private watchTripleClick() {
        this.tripleClick$
        .subscribe(() => {
            this.selection.selectAll(this.inputText.rawInput);
            this.inputText.calculateHtmlInput();
        });
    }
}
