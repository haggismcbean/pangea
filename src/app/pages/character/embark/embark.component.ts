import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
        private characterService: CharacterService
    ) {
        // get list of characters
        this.characterService
            .getCharacters()
            .subscribe((characters: Character[]) => {
                this.characters = characters;
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
