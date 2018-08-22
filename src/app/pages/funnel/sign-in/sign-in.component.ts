import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

    constructor(
        private router: Router,
        private authenticationWebService: AuthenticationWebService
    ) {
    }

    public signIn(): void {
        this.authenticationWebService
            .login(this.form)
            .subscribe((response) => {
                console.log('response!', response);
            });
    }
}
