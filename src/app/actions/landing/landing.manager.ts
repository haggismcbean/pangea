import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Feed } from '../../models/feed.model';
import { Message } from '../../models/message.model';
import { DelayedMessages } from '../../models/delayed-messages.model';

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

        this.delayedMessages = new DelayedMessages(mainFeedStream);

        this.delayedMessages.addMessage(this.getAnnouncement(this.ANNOUNCEMENT));
        this.delayedMessages.addMessage(this.getCta(this.SIGN_UP_NOW));
        this.delayedMessages.addMessage(this.getMessage(this.MESSAGE_ONE));
        this.delayedMessages.addMessage(this.getCta(this.SIGN_UP_NOW));
        this.delayedMessages.addMessage(this.getMessage(this.MESSAGE_TWO));
        this.delayedMessages.addMessage(this.getCta(this.BECOME_CELEB));
        this.delayedMessages.addMessage(this.getMessage(this.MESSAGE_THREE));
        this.delayedMessages.addMessage(this.getCta(this.CERTAIN_DEATH));
        this.delayedMessages.addMessage(this.getMessage(this.MESSAGE_FOUR));
        this.delayedMessages.addMessage(this.getAnnouncement(this.END_ANNOUNCEMENT));
    }

    public cancelMessages() {
        this.delayedMessages.cancelMessages();
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
