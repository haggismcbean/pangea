import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject, Observable, of, pipe } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';

import { AuthenticationWebService } from '../../web-services/authentication-web.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class RegisterManager {
    public userRegisteredStream;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private email: string;

    constructor(
        private authenticationWebService: AuthenticationWebService,
        private userService: UserService,
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.userRegisteredStream = new Subject();

        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        const registerOption = new Option('sign up now');

        registerOption
            .selectedStream
            .subscribe(() => {
                this.onOptionSelected();
            });

        this.optionsStream.next(registerOption);
    }

    private onOptionSelected() {
        const namePrompt = new Prompt('name');

        namePrompt
            .answerStream
            .subscribe((name: string) => {
                this.onNameProvided(name);
            });

        this.promptStream.next(namePrompt);
    }

    private onNameProvided(name: string) {
        const emailPrompt = new Prompt('email');

        emailPrompt
            .answerStream
            .subscribe((email: string) => {
                this.onEmailProvided(name, email);
            });

        this.promptStream.next(emailPrompt);
    }

    private onEmailProvided(name: string, email: string) {
        const passwordPrompt = new Prompt('password');
        passwordPrompt.isPassword = true;

        passwordPrompt
            .answerStream
            .subscribe((password: string) => {
                this.onPasswordProvided(name, email, password);
            });

        this.promptStream.next(passwordPrompt);
    }

    private onPasswordProvided(name: string, email: string, password: string) {
        const confirmPasswordPrompt = new Prompt('confirm password');
        confirmPasswordPrompt.isPassword = true;

        confirmPasswordPrompt
            .answerStream
            .subscribe((passwordConfirmation: string) => {
                this.onConfirmPasswordProvided(name, email, password, passwordConfirmation);
            });

        this.promptStream.next(confirmPasswordPrompt);
    }

    private onConfirmPasswordProvided(name: string, email: string, password: string, passwordConfirmation: string) {
        this.authenticationWebService
            .register({
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
            })
            .subscribe(
                (registerResponseData) => {
                    this.userRegisteredStream
                        .next(registerResponseData);
                }, (rawError) => {
                    console.log('error');
                    const error = new Message(0);
                    error.setText('error: ' + rawError.error.error);
                    error.setClass('error');
                    this.mainFeedStream.next(error);
                }
            );
    }
}
