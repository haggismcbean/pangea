import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { ILoginResponseData } from '../web-service-interfaces/i-login.authentication-service';

@Injectable()
export class UserService {
    public user: User;

    public newUser(user: ILoginResponseData) {
        this.user = new User(user.id);

        this.user.setToken(user.api_token);
        this.user.setEmail(user.email);
        this.user.setName(user.name);

        return this.user;
    }

    public getUser() {
        return this.user;
    }
}
