import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

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

        const loginOption = new Option('log in');

        loginOption
            .selectedStream
            .subscribe(() => {
                this.onOptionSelected();

                // clear messages feed
                const clearMessage = new Message(0);
                clearMessage.isClear = true;
                this.mainFeedStream.next(clearMessage);
            });

        this.optionsStream.next(loginOption);
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
                    // TODO - that '1' needs to be the character id :P
                    this.webSocketService.connect(response.token, 1);
                    return this.characterService
                        .getCharacters();
                })
            )
            .subscribe(
                (characters: Character[]) => {
                    return this.userLoggedInStream.next(characters[0]);
                }, (rawError) => {
                    const error = new Message(0);
                    error.setText('error: ' + rawError.error.message);
                    error.setClass('error');
                    this.mainFeedStream.next(error);
                }

            );
    }
}
