import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { ILoginResponseData } from '../web-service-interfaces/i-login.authentication-service';

@Injectable()
export class UserService {
    private user: User;
    private readonly USER_KEY = 'USER_KEY';

    public newUser(user: ILoginResponseData) {
        this.user = new User(user.id);

        this.user.setToken(user.api_token || user.token);
        this.user.setEmail(user.email);
        this.user.setName(user.name);

        localStorage.setItem(this.USER_KEY, JSON.stringify(this.user));

        return this.user;
    }

    public getUser() {
        if (this.user) {
            return this.user;
        } else {
            return this.getCachedUser();
        }
    }

    private getCachedUser() {
        const cachedUser = JSON.parse(localStorage.getItem(this.USER_KEY));

        if (cachedUser) {
            return this.newUser(cachedUser);
        }
    }
}
