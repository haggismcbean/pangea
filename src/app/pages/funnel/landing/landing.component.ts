import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'pan-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['../../../app.component.css', './landing.component.css']
})
export class LandingComponent {
    runningYears = 101;

    constructor(
        private router: Router
    ) {}

    public signUp() {
        this.runningYears = 123;
        this.router.navigate(['/sign-up']);
    }
}
