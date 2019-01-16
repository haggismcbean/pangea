import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';

import { Feed } from '../../../models/feed.model';
import { Option } from '../../../actions/option.model';
import { Prompt } from '../../../actions/prompt.model';
import { Message } from '../../../models/message.model';

import { LandingManager } from '../../../actions/landing/landing.manager';
import { LoginManager } from '../../../actions/login/login.manager';

@Component({
    selector: 'pan-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
    public feed: Feed;
    public options: Option[] = [];
    public prompt: Prompt;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    constructor(
        private router: Router,
        private loginManager: LoginManager,
        private landingManager: LandingManager
    ) {
        this.feed = new Feed();

        this.mainFeedStream = new Subject();
        this.optionsStream = new Subject();
        this.promptStream = new Subject();

        this.mainFeedStream
            .subscribe((message: Message) => {
                this.feed.addMessage(message);
            });

        this.optionsStream
            .subscribe((option: Option) => {
                this.options.push(option);
            });

        this.promptStream
            .subscribe((prompt: Prompt) => {
                this.prompt = prompt;
            });
    }

    public ngOnInit() {
        this.landingManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);
        this.setInputOptions();

        this.loginManager
            .userLoggedInStream
            .subscribe((user) => {
                console.log('user logged in!');
                console.log(user);
            });
    }

    private setInputOptions() {
        this.loginManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);
    }

    public signUp(input: string) {
        console.log(input);
        // this.router.navigate(['/sign-up']);
    }

    public signIn(input: string) {
        console.log(input);
        // this.router.navigate(['/sign-in']);
    }
}
