import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

import * as _ from 'lodash';

@Injectable()
export class InputService {
    constructor(
    ) {}

}

// const interacts = this.getInteractOptions();
        // this.options.push(interacts);

        // const movesTo = this.getMovesToOptions();
        // this.options.push(movesTo);

        // this.hints.push({
        //     option: 'looks at',
        //     options: [
        //         {
        //             option: 'people',
        //             options: [{
        //                 option: 'george'
        //             }, {
        //                 option: 'phil'
        //             }, {
        //                 option: 'bob'
        //             }]
        //         }
        //     ]
        // });

        // this.hints.push({
        //     option: 'names',
        //     examples: [
        //         'zone',
        //         'person',
        //         'animal species',
        //         'plant species',
        //     ]
        // });

        // this.hints.push({
        //     option: 'inventory',
        //     examples: []
        // });

        // this.hints.push({
        //     option: 'does',
        //     examples: [
        //         'cooking',
        //         'crafting',
        //         'forging',
        //         'eating',
        //         'building'
        //     ]
        // });

        // this.hints.push({
        //     option: 'puts',
        //     examples: [
        //         'in bag',
        //         'down',
        //         'onto',
        //         'in hands of',
        //     ]
        // });

        // this.hints.push({
        //     option: 'attacks',
        //     examples: [
        //         'person',
        //         'animal',
        //     ]
        // });

    // private getInteractOptions() {
    //     const interacts = new Option('interacts');
    //     // TODO - add all the people in the location
    //     //
    //     // const with = new Option('with');
    //     // const bob = new Option('bob');
    //     // with.addOptions([bob]);
    //     //
    //     const loudly = new Option('loudly');

    //     interacts.setOptions([loudly]);

    //     return interacts;
    // }

    // private getMovesToOptions() {
    //     const movesTo = new Option('moves to');
    //     // TODO - add zones baby!
    //     //
    //     const north = new Option('north');
    //     const south = new Option('south');
    //     const east = new Option('east');
    //     const west = new Option('west');

    //     movesTo.setOptions([north, south, east, west]);

    //     return movesTo;
    // }