import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';

import { AuthenticationWebService } from '../../../web-services/authentication-web.service';


@Component({
    selector: 'pan-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['../../../app.component.css', './sign-in.component.css']
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

    public message = {
        message: '',
        user: this.user
    };

    public newMessage = '';

    public messages = [];

    constructor(
        private router: Router,
        private authenticationWebService: AuthenticationWebService,
        private http: HttpClient
    ) {}

    public signIn(): void {
        this.authenticationWebService
            .login(this.form)
            .subscribe((response: any) => {
                console.log('response!', response);
                this.user.api_token = response.data.api_token;
                this.user.email = response.data.email;
                this.user.id = response.data.id;

                this.router.navigate(['/pangea']);
            });
    }
}
