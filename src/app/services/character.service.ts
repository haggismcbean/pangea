import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Character } from '../models/character.model';
import { CharacterWebService } from '../web-services/character-web.service';

import * as _ from 'lodash';

@Injectable()
export class CharacterService {
    private characters: Character[];

    constructor(
        private characterWebService: CharacterWebService
    ) {}

    public getCharacters(): Observable<Character[]> {
        if (this.characters) {
            return of(this.characters);
        } else {
            return this.fetchCharacters();
        }
    }

    public getCharacter(characterId: number): Observable<Character> {
        if (this.characters) {
            return of(_.find(this.characters, {'id': characterId}));
        } else {
            return this.fetchCharacters()
                .pipe(
                    map(() => {
                        return _.find(this.characters, {'id': characterId});
                    })
                );
        }
    }

    public create(): Observable<Character> {
        return this.characterWebService
            .create()
            .pipe(
                map((character) => {
                    return this.newCharacter(character);
                })
            );
    }

    public attack(characterId: number): Observable<any> {
        return this.characterWebService
            .attack(characterId);
    }


    private fetchCharacters(): Observable<Character[]> {
        return this.characterWebService
            .get()
            .pipe(
                map((characters) => {
                    return this.newCharacters(characters);
                })
            );
    }

    private newCharacters(characters): Character[] {
        this.characters = _.map(characters, (_character) => {
            return this.newCharacter(_character);
        });

        return this.characters;
    }

    private newCharacter(_character): Character {
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
    }
}
