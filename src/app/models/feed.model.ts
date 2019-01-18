import { Subject } from 'rxjs';

import { Message } from './message.model';

export class Feed {
    public messageStream: Subject<Message>;

    constructor() {
        this.messageStream = new Subject();

        this.messageStream.subscribe((message) => {
            console.log('message: ', message);
        });
    }

    public addMessage(message: Message): Feed {
        console.log('adding message');
        this.messageStream.next(message);

        return this;
    }
}
