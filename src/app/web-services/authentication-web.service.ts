import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { UserService } from '../services/user.service';

import { ILoginResponseData } from '../web-service-interfaces/i-login.authentication-service';

@Injectable()
export class AuthenticationWebService {
    constructor(
        private api: ApiService,
        private userService: UserService
    ) {}

    public register(form) {
        const url = `register`;
        const credentials = {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation
        };

        return this.api
            .post(url, credentials);
    }

    public login(form): any {
        const url = `login`;
        const credentials = {
            email: form.email,
            password: form.password
        };

        return this.api
            .post(url, credentials)
            .pipe(
                map((body: any) => body.data)
            )
            .pipe(
                map((user: ILoginResponseData) => this.userService.newUser(user))
            );
    }

    public getPasswordEmail(form) {
        const url = `password/email`;
        const credentials = {
            email: form.email,
        };

        return this.api
            .post(url, credentials);
    }

    public resetPassword(form) {
        const url = `password/reset`;
        const credentials = {
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation,
            token: form.token,
        };

        return this.api
            .post(url, credentials);
    }
}
