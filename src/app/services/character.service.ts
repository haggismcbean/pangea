import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Character } from '../models/character.model';

import * as _ from 'lodash';

@Injectable()
export class CharacterService {
    private characters: Character[];

    public newCharacters(characters): Character[] {
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

        return this.characters;
    }

    public getCharacter(characterId: number): Character {
        console.log('characters: ', this.characters);
        console.log('characterId: ', characterId);
        return _.find(this.characters, {'id': characterId});
    }
}
