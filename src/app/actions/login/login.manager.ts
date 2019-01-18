import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { User } from '../../models/user.model';

import { AuthenticationWebService } from '../../web-services/authentication-web.service';
import { UserService } from '../../services/user.service';

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
        private userService: UserService,
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
                map((loginResponseData: ILoginResponseData) => {
                    this.userService.newUser(loginResponseData);
                    console.log('logged in mother fucker', loginResponseData);
                    return this.userService.getUser();
                })
            )
            .subscribe((user: User) => {
                this.userLoggedInStream.next(user);
            });
    }
}
