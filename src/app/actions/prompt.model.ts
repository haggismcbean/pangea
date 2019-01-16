import { Subject } from 'rxjs';

export class Prompt {

    public name: string;
    public answerStream: Subject<any>;

    constructor(name: string) {
        this.name = name;

        this.answerStream = new Subject();
    }
}
