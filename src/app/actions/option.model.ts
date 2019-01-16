import { Subject } from 'rxjs';

export class Option {

    public name: string;
    public options: Option[];
    public selectedStream: Subject<any>;

    constructor(name: string) {
        this.name = name;

        this.selectedStream = new Subject();
    }

    public setOptions(options: Option[]): Option {
        this.options = options;
        return this;
    }
}
