import * as _ from 'lodash';

import { InputText } from '../input-text.model';
import { Selection } from '../selection.model';

export class PromptMode {
    public selection: Selection;
    public inputText: InputText;

    public promptText;
    private prompt;
    private panelStream;

	constructor(input: InputText, selection: Selection) {
		this.inputText = input;
		this.selection = selection;
	}

	public setPrompt(prompt) {
		this.prompt = prompt;
	}

	public setPanelStream(panelStream) {
		this.panelStream = panelStream;
	}

	public enter() {
        this.prompt
            .answerStream
            .next(this.inputText);

        this.prompt = undefined;
        this.inputText.deleteText();
	}

	public backspace() {
		if (
            this.selection.end - 1 === this.inputText.rawInput.length &&
            this.selection.start + 1 >= this.selection.end
        ) {
            const inputLength = this.inputText.rawInput.length;
            this.inputText.deleteText(inputLength - 1, inputLength);
            this.selection.selectEnd(this.inputText.rawInput);
        } else {
            this.inputText.deleteText(this.selection.start, this.selection.end);
            this.selection.select(this.selection.start, this.selection.start + 1);
        }
        
        this.inputText.calculateHtmlInput();
	}

	public tab() {

	}

	public input(keyboardEvent) {
        this.inputText.deleteText(this.selection.start, this.selection.end);
        this.inputText.addText(keyboardEvent.key);
        this.selection.selectEnd(this.inputText.rawInput);
	}

	public escape() {
        this.resetInput();
        this.panelStream.next('');
	}

	public resetInput() {
        this.inputText.deleteText();
	}

    // shared

    public arrow(direction) {
        if (direction === 'left') {
            if (this.selection.start === 0) {
                return;
            }

            this.selection.select(this.selection.start - 1, this.selection.start);
        }

        if (direction === 'right') {
            if (this.selection.start === this.inputText.rawInput.length) {
                return;
            }

            this.selection.select(this.selection.start + 1, this.selection.start + 2);
        }

        this.inputText.calculateHtmlInput();
    }
}
