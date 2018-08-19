import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'pan-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
    runningYears: number = 101;

    constructor(
        private router: Router
    ) {}

    // public signUp() {
    //     console.log('clicked!');
    //     this.router.navigate(['/sign-up']);
    // }
}
