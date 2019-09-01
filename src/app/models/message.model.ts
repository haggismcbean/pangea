import * as moment from 'moment';

export class Message {

    public id: number;
    public text: string;
    public date: moment.Moment;
    public isShowing: boolean;
    public isClear: boolean;

    public source: {
        id: null,
        name: null
    };
    public class: string;

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
        this.date = moment(date);
        return this;
    }

    public setSource(source): Message {
        // character (name), system
        this.source = source;
        return this;
    }

    public setAction(action: any): Message {
        this.action = action;
        return this;
    }
}
