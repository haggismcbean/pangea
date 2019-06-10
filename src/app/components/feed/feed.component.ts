import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

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
    public hasUnreadMessages = false;

    constructor() {}

    public ngOnInit() {
        this.feed
            .messageStream
            .subscribe((message) => {
                console.log('message received!', message);
                if (message.isClear) {
                    this.messages = [];
                    this.hasUnreadMessages = false;
                } else {
                    this.messages.push(message);
                    this.hasUnreadMessages = true;
                    this.showNextMessage();
                }
            });
    }

    private showNextMessage() {
        const nextMessage = _.find(this.messages, {isShowing: false});

        if (nextMessage) {
            nextMessage.isShowing = true;
        }

        if (!_.find(this.messages, {isShowing: false})) {
            this.hasUnreadMessages = false;
        }
    }
}
