import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { BackendService } from '~/shared/services/backend.service';

@Injectable()
export class AuthenticationWebService {
    private baseUrl = 'http://local.pangea-api.com:8888/api';

    constructor(
        private http: HttpClient,
    ) {}

    public register(form) {
        const url = `${this.baseUrl}/register`;
        const credentials = {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, credentials);
    }

    public login(form): any {
        const url = `${this.baseUrl}/login`;
        const credentials = {
            email: form.email,
            password: form.password
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, credentials);
    }

    // public logout() {

    // }

    public getPasswordEmail(form) {
        const url = `${this.baseUrl}/password/email`;
        const credentials = {
            email: form.email,
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, credentials);
    }

    public resetPassword(form) {
        const url = `${this.baseUrl}/password/reset`;
        const credentials = {
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation,
            token: form.token,
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, credentials);
    }


    // chat stuff!

    public fetchMessages(token) {
        const url = `${this.baseUrl}/messages?api_token=${token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .get<any>(url);
    }

    public addMessage(message) {
        const url = `${this.baseUrl}/messages?api_token=${message.user.api_token}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http
            .post<any>(url, message);
    }
}
