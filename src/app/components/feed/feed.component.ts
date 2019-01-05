import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
    selector: 'pan-feed',
    templateUrl: 'feed.component.html',
    styleUrls: [
        './feed.component.scss',
    ],
})
export class FeedComponent {
    @Input() public messages: Message[];

    constructor() {
    	console.log('messages: ', this.messages);
    }
}
