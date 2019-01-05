import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'pan-feed',
    templateUrl: 'feed.component.html',
    styleUrls: [
        './feed.component.scss',
    ],
})
export class FeedComponent {
    @Input() public messages: Text[];
}
