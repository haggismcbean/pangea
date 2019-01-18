import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Feed } from '../../models/feed.model';
import { Message } from '../../models/message.model';

@Component({
    selector: 'pan-feed',
    templateUrl: 'feed.component.html',
    styleUrls: [
        './feed.component.scss',
    ],
})
export class FeedComponent implements OnInit {
    @Input() public feed: Feed;

    public messages: Message[] = [];

    constructor() {}

    public ngOnInit() {
        this.feed
            .messageStream
            .subscribe((message) => {
                this.messages.push(message);
            });
    }
}
