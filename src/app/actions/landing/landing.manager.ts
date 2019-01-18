import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Feed } from '../../models/feed.model';
import { Message } from '../../models/message.model';

@Injectable()
export class LandingManager {
    private BORING_MESSAGE = 'And then they picked it up and ran around for a little bit and then they put it down and the big guy with the heavy sideburns tried to pick it up but they wouldn\'t let him and someone else picked it up and they threw it downfield with all the gusto and penache we\'ve come to expect from this fine team. And the other team gather it up and then bam they\'re on them and the ball falls loose and the kicker runs up and he\'s just going to kick it and ';
    private ANNOUNCEMENT = '---Compulsory ad break---';
    private SIGN_UP_NOW = 'Sign up now';
    private MESSAGE_ONE = 'Are you bored? Lonely? Tired of that dull empty feeling day in day out? Well why don\'t you colonize an alien planet with a group of strangers instead?!';
    private MESSAGE_TWO = 'A once in a lifetime opportunity to spend the rest of your life doing something interesting for once. With nothing but your wits and a few supplies to help you, you\'ll be dropped into the middle of an alien wasteland';
    private BECOME_CELEB = 'Become a celebrity!';
    private MESSAGE_THREE = 'Your every move will be followed by our drones and converted seamlessly into brainchip text. Your friends and loved ones back on earth will eagerly follow how you do. Will you be become leader of your tribe? Be a brave warrior in the face of impossible foes? Discover how to make fire or smelt a precious ore? Or will you be eaten by a two headed alien monster the day you land? Only one way to find out!';
    private CERTAIN_DEATH = 'A one way ticket to almost certain death!';
    private MESSAGE_FOUR = 'You\'ll be signing your life away, but who wants that boring old life anyway? Had enough of toiling away your best years just so you can grow old and die and never be remembered for anything? Come and settle Pangea and make a name for yourself. The most popular text feed on earth for the past 3 months running wants YOU to come and be a hero';

    public init(mainFeedStream, optionsStream, promptStream) {
        mainFeedStream.next(this.getBoringMessage());
        mainFeedStream.next(this.getAnnouncement(this.ANNOUNCEMENT));
        mainFeedStream.next(this.getCta(this.SIGN_UP_NOW));
        mainFeedStream.next(this.getMessage(this.MESSAGE_ONE));
        mainFeedStream.next(this.getCta(this.SIGN_UP_NOW));
        mainFeedStream.next(this.getMessage(this.MESSAGE_TWO));
        mainFeedStream.next(this.getCta(this.BECOME_CELEB));
        mainFeedStream.next(this.getMessage(this.MESSAGE_THREE));
        mainFeedStream.next(this.getCta(this.CERTAIN_DEATH));
        mainFeedStream.next(this.getMessage(this.MESSAGE_FOUR));
        mainFeedStream.next(this.getAnnouncement(this.ANNOUNCEMENT));
        mainFeedStream.next(this.getBoringMessage());
    }

    public cancelIntro() {
        // TODO
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