export class Text {

    public id: number;
    public text: string;
    public color: string;
    public date: string;

    constructor(id: number) {
        this.id = id;
    }

    public setText(text: string): Text {
        this.text = text;
        return this;
    }

    public setColor(color: string): Text {
        this.color = color;
        return this;
    }

    public setDate(date: any): Text {
        this.date = date;
        return this;
    }
}
