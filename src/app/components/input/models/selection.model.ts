export class Selection {

    public start: number;
    public end: number;
    public blinker: number;

    constructor() {
        this.start = 0;
        this.end = 1;
        this.blinker = this.start;
    }

    public selectAll(text) {
        this.start = 0;
        this.end = text.length;
        this.blinker = this.end;
    }

    public selectEnd(text) {
        this.start = text.length;
        this.end = text.length + 1;
        this.blinker = this.end;
    }

    public select(start, end = undefined, blinker = undefined) {
        this.start = start;
        this.end = end;
        this.blinker = blinker;

        if (blinker === undefined) {
            this.blinker = this.end;
        }
    }
}
