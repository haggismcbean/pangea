import { Injectable } from '@angular/core';

import { Option } from '../option.model';

import { AuthenticationWebService } from '../../web-services/authentication-web.service';
import { UserService } from '../../services/user.service';

import { ILoginResponseData } from '../../web-service-interfaces/i-login.authentication-service';

@Injectable()
export class LoginManager {

    constructor(
        private authenticationWebService: AuthenticationWebService,
        private userService: UserService,
    ) {
        console.log('success!', this.authenticationWebService);
    }

    public getLoginAction(): Option {
        const login = new Option('log in');
        login.setSelectedCallback(this.onOptionSelected.bind(this));

        return login;
    }

    public onOptionSelected() {
        this.authenticationWebService
            .login({
                email: 'admin@test.com',
                password: 'password',
            })
            .subscribe((loginResponseData: ILoginResponseData) => {
                this.userService.newUser(loginResponseData);
                console.log('logged in mother fucker', loginResponseData);
            });
    }
}
