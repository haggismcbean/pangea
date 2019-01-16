import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';

import { AuthenticationWebService } from '../../web-services/authentication-web.service';
import { UserService } from '../../services/user.service';

import { ILoginResponseData } from '../../web-service-interfaces/i-login.authentication-service';

@Injectable()
export class LoginManager {
    private email: string;

    constructor(
        private authenticationWebService: AuthenticationWebService,
        private userService: UserService,
    ) {}

    public addLoginAction(options): void {
        const login = new Option('log in');
        login.setSelectedCallback(this.onOptionSelected.bind(this));

        options.push(login);
    }

    public onOptionSelected(): Observable<Prompt> {
        const email = new Prompt('email');
        email.setAnsweredCallback(this.onEmailProvided.bind(this));

        return of(email);
    }

    public onEmailProvided(email: string): Observable<Prompt> {
        console.log('email? ', email);
        this.email = email;
        const password = new Prompt('password');
        password.setAnsweredCallback(this.onPasswordProvided.bind(this));

        return of(password);
    }

    public onPasswordProvided(password: string): Observable<any> {
        console.log('email: ', this.email, 'password: ', password);
        return this.authenticationWebService
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
            );
    }
}
