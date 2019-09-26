import * as _ from 'lodash';

import { InputText } from '../input-text.model';
import { Selection } from '../selection.model';
import { OptionsTree } from '../options-tree.model';
import { HintedOption } from '../hinted-option.model';

export class OptionsMode {
    public selection: Selection;
    public inputText: InputText;
    public optionsTree: OptionsTree;
    public hintedOption: HintedOption;

    private options;
    private originalOptions;
    private panelStream;

	constructor(input: InputText, selection: Selection) {
		this.inputText = input;
		this.selection = selection;
	}

	public setOptionsTree(optionsTree: OptionsTree) {
		this.optionsTree = optionsTree;
	}

	public setOptions(options) {
		this.options = options;
		this.optionsTree.setCurrentOptions(this.options);
	}

	public setOriginalOptions(originalOptions) {
		this.originalOptions = originalOptions;
		this.optionsTree.setOriginalOptions(originalOptions);
	}

	public setPanelStream(panelStream) {
		this.panelStream = panelStream;
	}

	public enter() {
        const clippedInput = this.optionsTree.clipOptionsInput(this.inputText.rawInput);
        _.replace(this.inputText.rawInput, clippedInput, '');

        const selectedOption = _.last(this.optionsTree.selectedOptions);

        if (selectedOption && !selectedOption.hasChildOptions()) {
            selectedOption
                .selectedStream
                .next(clippedInput);

            this.optionsTree.setCurrentOptions([]);
            this.resetInput();
        } else {
            this.optionsTree.setCurrentOptions(this.options);
            this.inputText.deleteText();
        }
	}

	public backspace() {
        this.handleBackspace();
        this.optionsTree.removeLastSelectedOption(this.inputText.rawInput);
	}

	private handleBackspace() {
        if (this.selection.start !== this.selection.end) {
            this.inputText.deleteText(this.selection.start, this.selection.end);
        } else {
            const inputLength = this.inputText.rawInput.length;
            this.inputText.deleteText(inputLength - 1, inputLength);
        }

        this.selection.selectEnd(this.inputText.rawInput);
	}

	public tab() {
        if (this.hintedOption) {
            this.selection.selectEnd(this.inputText.rawInput);
            this.inputText.addText(' ');
            this.optionsTree.selectOption(this.hintedOption.option);
            this.hintedOption = undefined;
        }
	}

	public input(keyboardEvent) {
        this.handleInput(keyboardEvent);

        if (this.optionsTree.currentOptions) {
            const _hintedOption = this.optionsTree.getHintedOption(this.inputText.rawInput);

            if (_hintedOption) {
            	this.hintedOption = new HintedOption(_hintedOption);
            }
        }

        if (this.hintedOption) {
            const hint = this.hintedOption.calculateHintText(this.optionsTree.clipOptionsInput(this.inputText.rawInput));
            this.inputText.addText(hint);

            const selectionStart = this.inputText.rawInput.length - hint.length;
            this.selection.select(selectionStart);

            this.inputText.calculateHtmlInput();
        }
	}

	private handleInput(keyboardEvent) {
        this.inputText.deleteText(this.selection.start, this.selection.end);
        this.inputText.addText(keyboardEvent.key);
        this.selection.selectEnd(this.inputText.rawInput);
	}

	public escape() {
        this.resetInput();

        this.optionsTree.setCurrentOptions(this.originalOptions);
        this.panelStream.next('');
	}

	public resetInput() {
        this.inputText.deleteText();
        this.optionsTree.clearSelectedOptions();
        this.hintedOption = undefined;
	}
}
