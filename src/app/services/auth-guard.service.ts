import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router,
        private userService: UserService
    ) {
    }

    public canActivate(): boolean {
        if (this.userService.getUser()) {
            return true;
        } else {
            this.router.navigate(['landing']);
        }
    }
}
