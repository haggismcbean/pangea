import { Subject } from 'rxjs';

import { Message } from './message.model';

export class Feed {
    public messageStream: Subject<Message>;

    constructor() {
        this.messageStream = new Subject();
    }

    public addMessage(message: Message): Feed {
        this.messageStream.next(message);

        return this;
    }
}
