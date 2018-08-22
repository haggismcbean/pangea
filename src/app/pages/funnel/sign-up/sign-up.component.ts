import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationWebService } from '../../../web-services/authentication-web.service';


@Component({
    selector: 'pan-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
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
        console.log('form: ', this);
        this.authenticationWebService
            .register(this.form)
            .subscribe((response) => {
                console.log('response!', response);
            });
    }
}
