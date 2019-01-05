import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Message } from '../../../models/message.model';

@Component({
    selector: 'pan-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    runningYears = 101;
    messages: Message[] = [];

    constructor(
        private router: Router
    ) {
        this.sendBoringMessage();
        this.sendAnnouncement('---Compulsory ad break---');
        this.sendCta('Sign up now');
        this.sendMessage('Are you bored? Lonely? Tired of that dull empty feeling day in day out? Well why don\'t you colonize an alien planet with a group of strangers instead?!');
        this.sendCta('Sign up now');
        this.sendMessage('A once in a lifetime opportunity to spend the rest of your life doing something interesting for once. With nothing but your wits and a few supplies to help you, you\'ll be dropped into the middle of an alien wasteland');
        this.sendCta('Become a celebrity!');
        this.sendMessage('Your every move will be followed by our drones and converted seamlessly into brainchip text. Your friends and loved ones back on earth will eagerly follow how you do. Will you be become leader of your tribe? Be a brave warrior in the face of impossible foes? Discover how to make fire or smelt a precious ore? Or will you be eaten by a two headed alien monster the day you land? Only one way to find out!');
        this.sendCta('A one way ticket to almost certain death!');
        this.sendMessage('You\'ll be signing your life away, but who wants that boring old life anyway? Had enough of toiling away your best years just so you can grow old and die and never be remembered for anything? Come and settle Pangea and make a name for yourself. The most popular text feed on earth for the past {{runningYears}} years running wants YOU to come and be a hero');
        this.sendAnnouncement('---Compulsory ad break---');
        this.sendBoringMessage();

        console.log('messages: ', this.messages);
    }

    private sendBoringMessage() {
        const message = new Message(0);
        message.setText('And then they picked it up and ran around for a little bit and then they put it down and the big guy with the heavy sideburns tried to pick it up but they wouldn\'t let him and someone else picked it up and they threw it downfield with all the gusto and penache we\'ve come to expect from this fine team. And the other team gather it up and then bam they\'re on them and the ball falls loose and the kicker runs up and he\'s just going to kick it and ');
        message.setClass('background-text');
        message.setDate('');

        this.messages.push(message);
    }

    private sendAnnouncement(text: string) {
        const message = new Message(0);
        message.setText(text);
        message.setClass('announcement');
        message.setDate('');

        this.messages.push(message);
    }

    private sendCta(text: string) {
        const message = new Message(0);
        message.setText(text);
        message.setClass('cta');
        message.setDate('');

        this.messages.push(message);
    }

    private sendMessage(text: string) {
        const message = new Message(0);
        message.setText(text);

        this.messages.push(message);
    }

    public signUp() {
        this.router.navigate(['/sign-up']);
    }

    public signIn() {
        this.router.navigate(['/sign-in']);
    }
}
