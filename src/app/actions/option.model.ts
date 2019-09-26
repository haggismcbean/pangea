import * as _ from 'lodash';

import { Subject } from 'rxjs';

export class Option {

    public name: string;
    public options: Option[];
    public selectedStream: Subject<any>;
    public isConcat = false;

    constructor(name: string) {
        this.name = name;

        this.selectedStream = new Subject();
    }

    public setOptions(options: Option[]): Option {
        if (this.options) {
            this.options = this.options.concat(options);
        } else {
            this.options = options;
        }

        return this;
    }

    public setOption(option: Option): Option {
        if (this.options) {
            this.options.push(option);
        } else {
            this.options = [option];
        }

        return this;
    }

    public hasChildOptions() {
        return this.options && this.options.length > 0;
    }
}
