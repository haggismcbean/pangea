import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import * as _ from 'lodash';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';
import { Character } from '../../models/character.model';

import { AuthenticationWebService } from '../../web-services/authentication-web.service';
import { CharacterService } from '../../services/character.service';
import { UserService } from '../../services/user.service';
import { WebSocketService } from '../../services/web-socket.service';

import { ILoginResponseData } from '../../web-service-interfaces/i-login.authentication-service';


@Injectable()
export class LoginManager {
    public userLoggedInStream;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private email: string;

    constructor(
        private authenticationWebService: AuthenticationWebService,
        private characterService: CharacterService,
        private userService: UserService,
        private webSocketService: WebSocketService,
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.userLoggedInStream = new Subject();

        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.characterService
            .getCharacters()
            .subscribe(
                (characters: Character[]) => {
                    this.clearMessageFeed();
                    this.setCurrentCharacter(characters);
                },
                (error) => {
                    const loginOption = new Option('log in');

                    loginOption
                        .selectedStream
                        .subscribe(() => {
                            this.onOptionSelected();
                        });

                    loginOption.isConcat = true;

                    this.optionsStream.next(loginOption);
                });

    }

    private onOptionSelected() {
        const emailPrompt = new Prompt('email');

        emailPrompt
            .answerStream
            .subscribe((email: string) => {
                this.onEmailProvided(email);
            });

        this.promptStream.next(emailPrompt);
    }

    private onEmailProvided(email: string) {
        this.email = email;
        const passwordPrompt = new Prompt('password');
        passwordPrompt.isPassword = true;

        passwordPrompt
            .answerStream
            .subscribe((password: string) => {
                this.onPasswordProvided(password);
            });

        this.promptStream.next(passwordPrompt);
    }

    private onPasswordProvided(password: string) {
        this.authenticationWebService
            .login({
                email: this.email,
                password: password,
            })
            .pipe(
                flatMap((response: any) => {
                    return this.characterService
                        .getCharacters();
                })
            )
            .subscribe(
                (characters: Character[]) => {
                    this.clearMessageFeed();
                    this.setCurrentCharacter(characters);
                },
                (rawError) => {
                    const error = new Message(0);
                    error.setText('error: ' + rawError.error.message);
                    error.setClass('error');
                    this.mainFeedStream.next(error);
                }

            );
    }

    private setCurrentCharacter(characters: Character[]) {
        // find first character that is alive.
        const character = _.find(characters, { isDead: false });

        // DEV : WHILST DEVELOPING RETRY LOGIC, I HAVE TO HIDE THESE IF BRACKETS. RESTORE LATER!!
        // if (!character) {
            // in the case that all our characters are dead, we are set to the last dead character
            character = _.findLast(characters, { isDead: true });
        // }

        this.characterService
            .setCurrent(character);

        this.webSocketService.addFeedStream(this.mainFeedStream);
        this.webSocketService.connect(this.userService.getUser().token, character.id);

        return this.userLoggedInStream.next(character);
    }

    private clearMessageFeed() {
        const clearMessage = new Message(0);
        clearMessage.isClear = true;
        this.mainFeedStream.next(clearMessage);
    }
}
