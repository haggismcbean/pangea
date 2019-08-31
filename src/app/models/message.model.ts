export class Message {

    public id: number;
    public text: string;
    public class: string;
    public date: string;
    public isShowing: boolean;
    public isClear: boolean;
    public action: any;

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

    public setAction(action: any): Message {
        this.action = action;
        return this;
    }
}
