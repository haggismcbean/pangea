export class Message {

    public id: number;
    public text: string;
    public class: string;
    public date: string;
    public isShowing: boolean;

    constructor(id: number) {
        this.id = id;
        this.isShowing = false;
    }

    public setText(text: string): Message {
        this.text = text;
        return this;
    }

    public setClass(_class: string): Message {
        this.class = _class;
        return this;
    }

    public setDate(date: any): Message {
        this.date = date;
        return this;
    }
}
