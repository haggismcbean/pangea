import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

// import { BackendService } from "~/shared/services/backend.service";

@Injectable()
export class AuthenticationWebService {
	private baseUrl: string = "http://local.pangea-api.com:8888/api";

    constructor(
        private http: HttpClient,
        // private errorService: ErrorService,
        // private backendService: BackendService
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
            "Content-Type": "application/json",
            "Accept": "application/json",
        });

    	return this.http
            .post<any>(url, credentials)
            .pipe(
                map((response) => {
                	console.log('response!', response);
            	})
            );
    }

    // public login() {

    // }

    // public logout() {

    // }

    // public passwordEmail() {

    // }

    // public passwordReset() {

    // }
}
