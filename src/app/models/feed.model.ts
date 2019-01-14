import { Observable, pipe, of } from 'rxjs';
import { map, concatMap, delay, pairwise } from 'rxjs/operators';

import { Message } from './message.model';

export class Feed {
    public messages: Observable<Message>;
    private messageQueue: Observable<Message>;

    private observer: any;
    private messageQueueObserver: any;
    private messageSentObserver: any;

    private delay: number;

    private isFirstMessage = true;
    private WORDS_PER_MILLISECOND: number = 300 / 60 / 1000;

    constructor() {
        this.messageQueue = new Observable((messageQueueObserver) => {
            this.messageQueueObserver = messageQueueObserver;
        });

        this.messages = new Observable((observer) => {
            this.observer = observer;
        });

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
            .subscribe((value) => {
                this.observer.next(value);
            });
    }

    public addMessage(message: Message): Feed {
        setTimeout(() => {
            if (this.isFirstMessage) {
                this.isFirstMessage = false;
                this.observer.next(message);
            }

            this.messageQueueObserver.next(message);
        });

        return this;
    }

    private calculateTimeout(message: Message): number {
        const numberOfWords = message.text.split(' ').length;
        return numberOfWords / this.WORDS_PER_MILLISECOND;
    }
}
