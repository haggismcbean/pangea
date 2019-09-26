export class Selection {

    public start: number;
    public end: number;

    constructor() {
        this.start = 0;
        this.end = 0;
    }

    public selectAll(text) {
        this.start = 0;
        this.end = text.length;
    }

    public selectEnd(text) {
        this.start = text.length;
        this.end = text.length;
    }

    public select(start, end = undefined) {
        this.start = start;
        this.end = end;
    }
}
