import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';

import { Feed } from '../../../models/feed.model';
import { Option } from '../../../actions/option.model';
import { Prompt } from '../../../actions/prompt.model';
import { Message } from '../../../models/message.model';
import { Character } from '../../../models/character.model';
import { DelayedMessages } from '../../../models/delayed-messages.model';

import { LandingManager } from '../../../actions/landing/landing.manager';
import { RegisterManager } from '../../../actions/register/register.manager';
import { LoginManager } from '../../../actions/login/login.manager';
import { CharacterCreationManager } from '../../../actions/character-creation/character-creation.manager';
import { LocationManager } from '../../../actions/location/location.manager';
import { MovementManager } from '../../../actions/movement/movement.manager';
import { LabourManager } from '../../../actions/labour/labour.manager';

import { CharacterService } from '../../../services/character.service';
import { ZoneService } from '../../../services/zone.service';

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
    public originalOptions: Option[] = [];
    public prompt: Prompt;
    public character: Character;

    public mainFeedStream;
    public optionsStream;
    public promptStream;
    public panelStream;

    public panel: string;

    constructor(
        private router: Router,
        private loginManager: LoginManager,
        private registerManager: RegisterManager,
        private landingManager: LandingManager,
        private characterCreationManager: CharacterCreationManager,
        private locationManager: LocationManager,
        private movementManager: MovementManager,
        private labourManager: LabourManager,

        private characterService: CharacterService,
        private zoneService: ZoneService,
        // DEV
        private authenticationWebService: AuthenticationWebService,
        // END DEV
    ) {
        this.feed = new Feed();

        this.mainFeedStream = new Subject();
        this.optionsStream = new Subject();
        this.promptStream = new Subject();
        this.panelStream = new Subject();

        this.mainFeedStream
            .subscribe((message: Message) => {
                this.feed.addMessage(message);

                if (message.class === 'error') {
                    this.setLandingOptions();
                }

                if (message.class === 'reset') {
                    this.setOptions();
                }
            });

        this.optionsStream
            .subscribe((option: Option) => {
                if (!option.isConcat) {
                    this.options = [];
                }

                this.options = this.options.concat([option]);
            });

        this.promptStream
            .subscribe((prompt: Prompt) => {
                this.prompt = prompt;
                this.options = [];
            });

        this.panelStream
            .subscribe((panel: string) => {
                console.log('panel: ', panel);
                this.panel = panel;
            });
    }

    public ngOnInit() {
        this.setLandingText();
        this.setLandingOptions();

        this.loginManager
            .userLoggedInStream
            .subscribe((user) => {
                this.character = this.characterService.getCurrent();

                this.landingManager.cancelMessages();

                if (this.character.isDead) {
                    this.getDeathText(this.character);
                    this.setDeadOptions();
                } else {
                    this.getWakeUpText(this.character);
                    this.setOptions();
                }
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
        this.originalOptions = this.options;
    }

    // CHARACTER CREATION

    private initCharacterCreation() {
        this.characterCreationManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);

        this.characterCreationManager
            .characterCreatedStream
            .subscribe((character) => {
            });
    }

    // WAKE UP TEXT

    private getWakeUpText(character) {
        this.zoneService
            .getWakeUpText(character.zoneId)
            .subscribe((wakeUpText) => {
                const delayedMessages = new DelayedMessages(this.mainFeedStream);

                const intro = new Message(0);
                intro.setText(wakeUpText.intro);
                intro.setClass('');
                delayedMessages.addMessage(intro);

                const location = new Message(0);
                location.setText('You find yourself in ' + wakeUpText.zone.description);
                location.setClass('');
                delayedMessages.addMessage(location);

                const farNature = new Message(0);
                farNature.setText(wakeUpText.farNature);
                farNature.setClass('');
                delayedMessages.addMessage(farNature);

                const closeNature = new Message(0);
                closeNature.setText(wakeUpText.closeNature);
                closeNature.setClass('');
                delayedMessages.addMessage(closeNature);

                const drone = new Message(0);
                drone.setText(wakeUpText.drone);
                drone.setClass('');
                delayedMessages.addMessage(drone);
            });
    }

    private setOptions() {
        this.options = [];

        // look at
        this.locationManager.init(this.mainFeedStream, this.optionsStream, this.promptStream, this.panelStream);

        // do
        this.labourManager.init(this.mainFeedStream, this.optionsStream, this.promptStream, this.panelStream);

        // move to
        this.movementManager.init(this.mainFeedStream, this.optionsStream, this.promptStream);

        this.originalOptions = this.options;
    }

    private getDeathText(character) {
        this.characterService
            .getDeathMessage(character.id)
            .subscribe((deathMessages) => {
                const death = new Message(0);
                death.setText(deathMessages[0].message);
                death.setClass('');
                this.mainFeedStream.next(death);
            });
    }

    private setDeadOptions() {
        this.options = [];

        const restartOption = new Option('start again');

        restartOption
            .selectedStream
            .subscribe(() => {
                const clearMessage = new Message(0);
                clearMessage.isClear = true;
                this.mainFeedStream.next(clearMessage);
                this.initCharacterCreation();
            });

        this.optionsStream.next(restartOption);
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
