import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationWebService } from '../../../web-services/authentication-web.service';


@Component({
    selector: 'pan-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['../../../app.component.css', './sign-up.component.scss']
})
export class SignUpComponent {
    public form = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    };

    constructor(
        private router: Router,
        private authenticationWebService: AuthenticationWebService
    ) {
    }

    public signUp(): void {
        this.authenticationWebService
            .register(this.form)
            .subscribe((response) => {
                console.log('response!', response);
            });
    }

    public forgotPassword(): void {
        this.router.navigate(['/get-password-email']);
    }
}
