import { Selection } from './selection.model';

export class InputText {

    private START_TAG = '<span class="input__suggestion">';
    private END_TAG = '</span>';

    public rawInput: string = '';
    public htmlInput: string = `${this.START_TAG}${this.END_TAG}`;
    public selection: Selection;

    constructor(input, selection) {
        this.rawInput = input;
        this.selection = selection;
    }

    public addText(text, startPosition = undefined) {
        if (!startPosition) {
            this.rawInput += text;
        } else {
            const oldRawInput = this.rawInput;
            this.rawInput = oldRawInput.slice(0, startPosition);
            this.rawInput += text;
            this.rawInput += oldRawInput.slice(startPosition);
        }

        return this.calculateHtmlInput();
    }

    public deleteText(startPosition = undefined, endPosition = undefined) {
        if (startPosition === undefined) {
            this.rawInput = '';
        }

        const oldRawInput = this.rawInput;

        this.rawInput = oldRawInput.slice(0, startPosition);

        if (endPosition) {
            this.rawInput += oldRawInput.slice(endPosition);
        }

        return this.calculateHtmlInput();
    }

    public calculateHtmlInput() {
        const startPosition = this.selection.start;
        const endPosition = this.selection.end;

        this.htmlInput = this.rawInput.slice(0, startPosition);
        this.htmlInput += this.START_TAG;
        this.htmlInput += this.rawInput.slice(startPosition, endPosition);
        this.htmlInput += this.END_TAG;

        if (endPosition !== undefined) {
            this.htmlInput += this.rawInput.slice(endPosition);
        }

        return this.htmlInput;
    }

    public getNotSelectedInput() {
        const rawInput = this.rawInput;

        let unselectedInput = rawInput.slice(0, this.selection.start);
        unselectedInput += rawInput.slice(this.selection.end);

        return unselectedInput;
    }

    public getSelectedInput() {
        const rawInput = this.rawInput;

        return rawInput.slice(this.selection.start, this.selection.end);
    }
}
