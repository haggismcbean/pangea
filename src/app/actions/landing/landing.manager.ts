import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Feed } from '../../models/feed.model';
import { Message } from '../../models/message.model';

@Injectable()
export class LandingManager {
    private ANNOUNCEMENT = '---Free user compulsory ad---';
    private SIGN_UP_NOW = 'Sign up now';
    private MESSAGE_ONE = 'Are you bored? Lonely? Tired of that dull empty feeling day in day out? Why don\'t you colonize an alien planet instead?!';
    private MESSAGE_TWO = 'Spend the rest of your life doing something interesting for once. With nothing but your wits to help you, you\'ll be dropped into an alien wasteland';
    private BECOME_CELEB = 'Become a celebrity!';
    private MESSAGE_THREE = 'Your every move will be followed by our drones and converted seamlessly into brainchip text. Your friends and loved ones back on earth will eagerly follow your every move.';
    private CERTAIN_DEATH = 'A one way ticket to almost certain death!';
    private MESSAGE_FOUR = 'You\'ll be signing your life away, but who wants that boring old life anyway?';
    private END_ANNOUNCEMENT = '---End compulsory ad---';

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    public init(mainFeedStream, optionsStream, promptStream) {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        mainFeedStream.next(this.getAnnouncement(this.ANNOUNCEMENT));
        mainFeedStream.next(this.getCta(this.SIGN_UP_NOW));
        mainFeedStream.next(this.getMessage(this.MESSAGE_ONE));
        mainFeedStream.next(this.getCta(this.SIGN_UP_NOW));
        mainFeedStream.next(this.getMessage(this.MESSAGE_TWO));
        mainFeedStream.next(this.getCta(this.BECOME_CELEB));
        mainFeedStream.next(this.getMessage(this.MESSAGE_THREE));
        mainFeedStream.next(this.getCta(this.CERTAIN_DEATH));
        mainFeedStream.next(this.getMessage(this.MESSAGE_FOUR));
        mainFeedStream.next(this.getAnnouncement(this.END_ANNOUNCEMENT));
    }

    private getBoringMessage() {
        const message = new Message(0);
        message.setText(this.BORING_MESSAGE);
        message.setClass('background-text');
        message.setDate('');

        return message;
    }

    private getAnnouncement(text: string) {
        const message = new Message(0);
        message.setText(text);
        message.setClass('announcement');
        message.setDate('');

        return message;
    }

    private getCta(text: string) {
        const message = new Message(0);
        message.setText(text);
        message.setClass('cta');
        message.setDate('');

        return message;
    }

    private getMessage(text: string) {
        const message = new Message(0);
        message.setText(text);

        return message;
    }
}
