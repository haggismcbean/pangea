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
    private current: Character;

    constructor(
        private characterWebService: CharacterWebService
    ) {}

    public getUserCharacters(): Observable<Character[]> {
        return this.characterWebService
            .getUserCharacters()
            .pipe(
                map((characters) => {
                    return this.newCharacters(characters);
                })
            );
    }

    public getCharacters({ isCacheBust }): Observable<Character[]> {
        if (this.characters && !isCacheBust) {
            return of(this.characters);
        } else {
            return this.fetchCharacters();
        }
    }

    public getCurrent(): Character {
        return this.current;
    }

    public setCurrent(character: Character): Character {
        this.current = character;
        return this.current;
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

    public getInventory(): Observable<any> {
        return this.characterWebService
            .inventory(this.current.id);
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

    public putDown(itemId: number, amount: number): Observable<any> {
        return this.characterWebService
            .putDown(itemId, amount);
    }

    public getCraftableItems(): Observable<any> {
        return this.characterWebService
            .getCraftableItems(this.current.id);
    }

    public craftRecipe(recipeId: number): Observable<any> {
        return this.characterWebService
            .craftRecipe(recipeId);
    }

    public addItemToActivity(activityId, itemId, amount): Observable<any> {
        return this.characterWebService
            .addItemToActivity(activityId, itemId, amount);
    }

    public workOnActivity(activityId): Observable<any> {
        return this.characterWebService
            .workOnActivity(activityId);
    }

    public stopWorkingOnActivity(activityId): Observable<any> {
        return this.characterWebService
            .stopWorkingOnActivity(activityId);
    }

    public hunt(itemId): Observable<any> {
        return this.characterWebService
            .hunt(itemId);
    }

    public cancelActivity(activityId): Observable<any> {
        return this.characterWebService
            .cancelActivity(activityId);
    }

    public getDeathMessage(characterId: number): Observable<any> {
        return this.characterWebService
            .getDeathMessage(characterId);
    }

    public eat(itemId: number) {
        return this.characterWebService
            .eat(itemId);
    }

    public giveItem(itemId, amount, characterId): Observable<any> {
        return this.characterWebService
            .giveItem(itemId, amount, characterId);
    }

    public pointAt(targetCharacterId): Observable<any> {
        return this.characterWebService
            .pointAt(this.current.id, targetCharacterId);
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

        _.forEach(this.characters, (character) => {
            if (character.id === _.get(this.current, 'id')) {
                this.current = character;
            }
        });

        return this.characters;
    }

    private newCharacter(_character): Character {
        const character = new Character(_character.id);

        character.appearance = _character.appearance;
        character.backstory = _character.backstory;
        character.personality = _character.personality;
        character.birthday = _character.birthday;
        character.createdAt = _character.created_at;
        character.forename = _character.forename;
        character.gender = _character.gender;
        character.height = _character.height;
        character.name = _character.name;
        character.posessivePronoun = _character.posessivePronoun;
        character.pronoun = _character.pronoun;
        character.strength = _character.strength;
        character.surname = _character.surname;
        character.updatedAt = _character.updated_at;
        character.userId = _character.user_id;
        character.weight = _character.weight;
        character.zoneId = _character.zone_id;
        character.groupId = _character.group_id;
        character.isDead = !!_character.is_dead;
        character.hunger = _character.hunger;
        character.health = _character.health;
        character.exposure = _character.exposure;

        return character;
    }

    public getLastMessage(characterId: number): Observable<any> {
        return this.characterWebService
            .getLastMessage(characterId);
    }

    public name(targetCharacter: Character, newName: string): Observable<any> {
        return this.characterWebService
            .name(targetCharacter.id, newName);
    }
}
