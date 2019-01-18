import { Subject } from 'rxjs';

export class Prompt {

    public name: string;
    public answerStream: Subject<any>;
    public isPassword: boolean;

    constructor(name: string) {
        this.name = name;

        this.answerStream = new Subject();

        this.isPassword = false;
    }
}
