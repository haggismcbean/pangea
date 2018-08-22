import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationWebService } from '../../../web-services/authentication-web.service';


@Component({
    selector: 'pan-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['../../../app.component.css', './reset-password.component.css']
})
export class ResetPasswordComponent {
    public form = {
        email: '',
        password: '',
        passwordConfirmation: '',
        token: '',
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationWebService: AuthenticationWebService
    ) {
        this.activatedRoute.params.subscribe(
            (params) => {
                this.form.token = params.token;
                this.router.navigate(['/sign-in']);
            }
        );
    }

    public resetPassword(): void {
        this.authenticationWebService
            .resetPassword(this.form)
            .subscribe((response) => {
                console.log('response!', response);
            });
    }
}
