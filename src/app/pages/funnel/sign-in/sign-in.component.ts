import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import { AuthenticationWebService } from '../../../web-services/authentication-web.service';
import { UserService } from '../../../services/user.service';

import { ILoginResponseData } from '../../../web-service-interfaces/i-login.authentication-service';


@Component({
    selector: 'pan-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['../../../app.component.css', './sign-in.component.scss']
})
export class SignInComponent {
    public form = {
        email: '',
        password: '',
    };

    public user = {
        api_token: '',
        name: 'Harry',
        email: '',
        id: 0
    };

    constructor(
        private router: Router,
        private authenticationWebService: AuthenticationWebService,
        private http: HttpClient,
        private userService: UserService
    ) {}

    public signIn(): void {
        this.authenticationWebService
            .login(this.form)
            .subscribe((loginResponseData: ILoginResponseData) => {
                this.userService.newUser(loginResponseData);

                this.router.navigate(['/embark']);
            });
    }
}
