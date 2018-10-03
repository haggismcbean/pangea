import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CharacterWebService } from '../../../web-services/character-web.service';
// import { Character } from '../../../models/character.model';

@Component({
    selector: 'pan-embark',
    templateUrl: './embark.component.html',
    styleUrls: ['../../../app.component.css']
})
export class EmbarkComponent {
    // public character: Character;

    constructor(
        private router: Router,
        private http: HttpClient,
        private characterWebService: CharacterWebService
    ) {
        // get list of characters
        this.characterWebService
            .get()
            .subscribe((response) => {
                console.log('hoooo boy here we are!', response);
            });
    }

    public enterPangea() {
        // todo
    }

    public embarkCharacter() {
        // todo
    }

    public createCharacter() {
        // todo
    }
}
