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
        if (this.selection.start !== this.selection.end) {
            this.inputText.deleteText(this.selection.start, this.selection.end);
        } else {
            const inputLength = this.inputText.rawInput.length;
            this.inputText.deleteText(inputLength - 1, inputLength);
        }

        this.selection.selectEnd(this.inputText.rawInput);

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
}
