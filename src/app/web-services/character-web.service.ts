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
        const url = `activity/create_new_activity`;

        return this.api
            .put(url, {
                recipeId: recipeId
            });
    }

    public addItemToActivity(activityId: number, itemId: number, amount: number) {
        const url = `activity/add_item_to_activity`;

        return this.api
            .post(url, {
                activityId: activityId,
                itemId: itemId,
                amount: amount
            });
    }

    public workOnActivity(activityId: number) {
        const url = `activity/work_on_activity`;

        return this.api
            .post(url, {
                activityId: activityId
            });
    }

    public stopWorkingOnActivity(activityId: number) {
        const url = `activity/stop_working_on_activity`;

        return this.api
            .post(url, {
                activityId: activityId
            });
    }

    public hunt(itemId: number) {
        const url = `character/hunt`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public createPlot(itemId: number) {
        const url = `character/createPlot`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public cancelActivity(itemId: number) {
        const url = `activity/cancel_activity`;

        return this.api
            .post(url, {
                itemId: itemId
            });

    }

    public getDeathMessage(characterId: number) {
        const url = `character/${characterId}/death_message`;

        return this.api
            .get(url, {
                characterId: characterId
            });
    }

    public eat(itemId) {
        const url = `character/eat`;

        return this.api
            .post(url, {
                itemId: itemId
            });
    }

    public giveItem(itemId, amount, characterId) {
        const url = `character/give`;

        return this.api
            .post(url, {
                itemId: itemId,
                itemQuantity: amount,
                characterId: characterId
            });
    }
}
