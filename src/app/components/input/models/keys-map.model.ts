export class KeysMap {
    private actions;
    private reset;

    private keysMap = {};

    constructor(actions, reset) {
        this.actions = actions;
        this.reset = reset;
    }

    public handleKeypress(keyboardEvent: KeyboardEvent) {
        this.keysMap[keyboardEvent.key] = keyboardEvent.type === 'keydown';

        // console.log(keyboardEvent.key);

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
            this.actions.backspace();
            return;
        }

        // if user presses enter
        if (keyboardEvent.key === 'Enter') {
            this.actions.enter();
            return;
        }

        // if user presses tab
        if (keyboardEvent.key === 'Tab') {
            keyboardEvent.preventDefault();
            this.actions.tab();
            return;
        }

        // if user presses escape
        if (keyboardEvent.key === 'Escape') {
            keyboardEvent.preventDefault();
            this.actions.escape();
            this.reset();
            return;
        }

        // if user presses left
        if (keyboardEvent.key === 'ArrowLeft') {
            if (this.keysMap['Shift']) {
                this.actions.shiftArrow('left')
            } else {
                this.actions.arrow('left');
            }

            return;
        }

        // if user presses left
        if (keyboardEvent.key === 'ArrowRight') {
            if (this.keysMap['Shift']) {
                this.actions.shiftArrow('right')
            } else {
                this.actions.arrow('right');
            }

            return;
        }

        // otherwise
        this.actions.input(keyboardEvent);
    }
}
