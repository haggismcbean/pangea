import { Component, OnInit, EventEmitter, HostListener, Input, Output } from '@angular/core';
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

    private keysMap = {};

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.handleKeypress(event);
    }

    @HostListener('window:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent) {
        this.handleKeypress(event);
    }

    constructor() {}

    public ngOnInit() {
        this.feed
            .messageStream
            .subscribe((message) => {
                if (message.isClear) {
                    this.messages = [];
                    this.hasUnreadMessages = false;
                } else {
                    this.messages.push(message);
                    this.hasUnreadMessages = true;
                }
            });
    }

    private handleKeypress(event) {
        this.keysMap[event.key] = event.type === 'keydown';

        // Cmd + m or Ctrl + m
        if (this.keysMap['Meta'] && this.keysMap['m'] || this.keysMap['Control'] && this.keysMap['m']) {
            this.keysMap['m'] = false;

            this.showNextMessage();
        }
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
