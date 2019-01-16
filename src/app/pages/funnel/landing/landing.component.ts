import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Feed } from '../../../models/feed.model';
import { Message } from '../../../models/message.model';
import { Option } from '../../../actions/option.model';

import { LandingManager } from '../../../actions/landing/landing.manager';
import { LoginManager } from '../../../actions/login/login.manager';

@Component({
    selector: 'pan-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
    public runningYears = 101;
    public feed: Feed;
    public options: Option[] = [];

    constructor(
        private router: Router,
        private loginManager: LoginManager,
        private landingManager: LandingManager
    ) {
        this.feed = new Feed();
    }

    public ngOnInit() {
        this.landingManager.beginIntro(this.feed);
        this.setInputOptions();
    }

    private setInputOptions() {
        this.loginManager.addLoginAction(this.options);
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
