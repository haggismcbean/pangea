import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { CharacterService } from '../../services/character.service';
import { WebSocketService } from '../../services/web-socket.service';

import { Message } from '../../models/message.model';
import { Character } from '../../models/character.model';

import { characterGlyph } from './constants/character';

@Component({
    selector: 'pan-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
    @Input() public character: Character;

    public inventory = {
        items: []
    };

    public characterGlyph;

    constructor(
        private characterService: CharacterService
    ) {}

    ngOnInit() {
        this.characterService
            .getInventory()
            .subscribe((items: any[]) => {
                this.inventory.items = items;
            });

        this.characterService
            .getCharacters(true)
            .subscribe(() => {
                this.character = this.characterService.getCurrent();
                console.log('character: ', this.character);
            });

        this.setPerson();
    }

    private setPerson() {
        if (this.character.gender === 'female') {
            this.characterGlyph = characterGlyph.WOMAN;
        } else {
            this.characterGlyph = characterGlyph.MAN;
        }
    }

    // private handleItemDescriptionOptionSelected(item) {
    //     const itemDescription = new Message(0);
    //     itemDescription.setText(
    //         `You look at a ${item.name}. ${item.description}There is a total of ${item.count}`
    //     );

    //     this.mainFeedStream
    //         .next(itemDescription);

    //     this.resetOptions();
    // }

    // private handleItemPutDownOptionSelected(item) {
    //     const amountPrompt = new Prompt(`how much would you like to put down? (max ${item.count})`);

    //     amountPrompt
    //         .answerStream
    //         .subscribe((amount: string) => {
    //             const itemQuantity = Number(amount);

    //             if (itemQuantity < 0 || itemQuantity > item.count) {
    //                 this.resetOptions();
    //                 return;
    //             }

    //             item.count -= itemQuantity;

    //             this.characterService
    //                 .putDown(item.id, itemQuantity)
    //                 .subscribe(
    //                     (response) => {
    //                         console.log('response: ', response);
    //                     },
    //                     (error) => this.resetOptions()
    //                 );
    //         });

    //     this.promptStream.next(amountPrompt);
    // }
}
