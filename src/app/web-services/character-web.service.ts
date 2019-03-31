import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class CharacterWebService {
    constructor(
        private api: ApiService
    ) {}

    public create() {
        const url = `character`;

        return this.api
            .post(url, {});
    }

    public get(): any {
        const url = `characters`;

        return this.api
            .get(url);
    }

    public inventory(characterId): any {
        const url = `character/${characterId}/inventory`;

        return this.api
            .get(url);
    }

    public attack(characterId: number): any {
        const url = `character/${characterId}/attack`;

        return this.api
            .post(url, {});
    }

    public putDown(itemId: number, amount: number): any {
        const url = `character/put_down`;

        return this.api
            .put(url, {
                itemId: itemId,
                itemQuantity: amount
            });
    }

    public getCraftableItems(characterId: number) {
        const url = `character/${characterId}/get_craftables`;

        return this.api
            .get(url);
    }

    public craftRecipe(recipeId: number) {
        const url = `character/create_new_activity`;

        return this.api
            .put(url, {
                recipeId: recipeId
            });
    }
}
