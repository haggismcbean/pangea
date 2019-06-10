import { Subject, Observable, pipe, zip, from, interval, of } from 'rxjs';
import { map, concatMap, delay, pairwise } from 'rxjs/operators';

import { Message } from './message.model';

export class Feed {
    public messageStream: Subject<Message>;
    private messageQueue: Subject<Message>;

    private observer: any;
    private messageQueueObserver: any;
    private messageSentObserver: any;

    private delay: number;

    private isFirstMessage = true;
    private WORDS_PER_MILLISECOND: number = 300 / 60 / 1000;
    private MAX_WAIT = 3000;

    constructor() {
        this.messageQueue = new Subject();

        this.messageStream = new Subject();

        this.messageQueue
            .pipe(
                pairwise(),
                concatMap(messages => {
                    const lastMessage = messages[0];
                    const currentMessage = messages[1];

                    const _delay = this.calculateTimeout(lastMessage);

                    return of(currentMessage)
                        .pipe(
                            delay(_delay)
                        );
                }),
            )
            .subscribe(message => {
                this.messageStream.next(message);
            });
    }

    public addMessage(message: Message): Feed {
        this.messageQueue.next(message);

        return this;
    }

    private calculateTimeout(message: Message): number {
        if (message.text) {
            const numberOfWords = message.text.split(' ').length;
            const waitTime = numberOfWords / this.WORDS_PER_MILLISECOND;

            if (waitTime > this.MAX_WAIT) {
                return this.MAX_WAIT;
            } else {
                return waitTime;
            }
        }


        return 0;
    }
}
