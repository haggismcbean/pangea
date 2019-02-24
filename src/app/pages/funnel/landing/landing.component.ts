import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';

import { Feed } from '../../../models/feed.model';
import { Option } from '../../../actions/option.model';
import { Prompt } from '../../../actions/prompt.model';
import { Message } from '../../../models/message.model';

import { LandingManager } from '../../../actions/landing/landing.manager';
import { RegisterManager } from '../../../actions/register/register.manager';
import { LoginManager } from '../../../actions/login/login.manager';
import { CharacterCreationManager } from '../../../actions/character-creation/character-creation.manager';

// DEV
import { AuthenticationWebService } from '../../../web-services/authentication-web.service';
// END DEV

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
        private registerManager: RegisterManager,
        private landingManager: LandingManager,
        private characterCreationManager: CharacterCreationManager,
        // DEV
        private authenticationWebService: AuthenticationWebService,
        // END DEV
    ) {
        this.feed = new Feed();

        this.mainFeedStream = new Subject();
        this.optionsStream = new Subject();
        this.promptStream = new Subject();

        this.mainFeedStream
            .subscribe((message: Message) => {
                this.feed.addMessage(message);

                if (message.class === 'error') {
                    this.setLandingOptions();
                }
            });

        this.optionsStream
            .subscribe((option: Option) => {
                this.options = this.options.concat([option]);
            });

        this.promptStream
            .subscribe((prompt: Prompt) => {
                this.prompt = prompt;
                this.options = [];
            });
    }

    public ngOnInit() {
        this.setLandingText();
        this.setLandingOptions();

        this.loginManager
            .userLoggedInStream
            .subscribe((user) => {
                console.log('user logged in!', user);
            });

        this.registerManager
            .userRegisteredStream
            .subscribe((response) => {
                this.initCharacterCreation();
            });

        // DEV
        // this.devActions();
        // END DEV
    }

    // LANDING

    private setLandingText() {
        setTimeout(() => {
            this.landingManager
                .init(this.mainFeedStream, this.optionsStream, this.promptStream);
        });
    }

    private setLandingOptions() {
        this.loginManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);
        this.registerManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);
        this.prompt = undefined;
    }

    // CHARACTER CREATION

    private initCharacterCreation() {
        this.characterCreationManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);

        this.characterCreationManager
            .characterCreatedStream
            .subscribe((character) => {
                console.log('character: ', character);
            });
    }

    // DEV
    private devActions() {
        // a private function to get us to where we want to be on page load.
        this.authenticationWebService
            .register({
                name: 'name',
                email: 'testaccount' + (Math.floor(Math.random() * 6234) + 1) + '@gmail.com',
                password: 'password',
                password_confirmation: 'password',
            })
            .subscribe(
                (registerResponseData) => {
                    this.initCharacterCreation();
                }, (rawError) => {
                    console.log('error: ', rawError);
                    const error = new Message(0);
                    error.setText('error: ' + rawError.error.error);
                    error.setClass('error');
                    this.mainFeedStream.next(error);
                }
            );
    }
    // END DEV
}
