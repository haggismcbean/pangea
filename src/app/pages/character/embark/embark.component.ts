import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CharacterWebService } from '../../../web-services/character-web.service';
import { CharacterService } from '../../../services/character.service';
import { Character } from '../../../models/character.model';

import * as _ from 'lodash';

@Component({
    selector: 'pan-embark',
    templateUrl: './embark.component.html',
    styleUrls: ['../../../app.component.css']
})
export class EmbarkComponent {
    public characters: Character[];

    constructor(
        private router: Router,
        private characterWebService: CharacterWebService,
        private characterService: CharacterService
    ) {
        // get list of characters
        this.characterWebService
            .get()
            .subscribe((characters) => {
                this.characters = this.characterService.newCharacters(characters);
            });
    }

    public enterPangea(character) {
        this.router.navigate(['/pangea'], {
            queryParams: {
                characterId: character.id
            }
        });
    }

    public embarkCharacter() {
        // todo
    }

    public createCharacter() {
        // todo
    }
}
