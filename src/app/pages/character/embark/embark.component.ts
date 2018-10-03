import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CharacterWebService } from '../../../web-services/character-web.service';
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
        private characterWebService: CharacterWebService
    ) {
        // get list of characters
        this.characterWebService
            .get()
            .subscribe((characters) => {
                this.characters = _.map(characters, (_character) => {
                    const character = new Character(_character.id);

                    character.appearance = _character.appearance;
                    character.backstory = _character.backstory;
                    character.personality = _character.personality;
                    character.birthday = _character.birthday;
                    character.created_at = _character.created_at;
                    character.forename = _character.forename;
                    character.gender = _character.gender;
                    character.height = _character.height;
                    character.name = _character.name;
                    character.posessivePronoun = _character.posessivePronoun;
                    character.pronoun = _character.pronoun;
                    character.strength = _character.strength;
                    character.surname = _character.surname;
                    character.updated_at = _character.updated_at;
                    character.user_id = _character.user_id;
                    character.weight = _character.weight;

                    return character;
                });
            });
    }

    public enterPangea(character) {
        this.router.navigate(['/pangea']);
    }

    public embarkCharacter() {
        // todo
    }

    public createCharacter() {
        // todo
    }
}
