import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationWebService } from '../../../web-services/authentication-web.service';


@Component({
    selector: 'pan-get-password-email',
    templateUrl: './get-password-email.component.html',
    styleUrls: ['../../../app.component.css', './get-password-email.component.scss']
})
export class GetPasswordEmailComponent {
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

    public getPasswordEmail(): void {
        this.authenticationWebService
            .getPasswordEmail(this.form)
            .subscribe((response) => {
                console.log('response!', response);
            });
    }
}
