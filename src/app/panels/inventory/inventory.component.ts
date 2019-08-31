import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { combineLatest } from 'rxjs';

import { CharacterService } from '../../services/character.service';
import { WebSocketService } from '../../services/web-socket.service';

import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';
import { Message } from '../../models/message.model';
import { Character } from '../../models/character.model';

import { characterGlyph } from './constants/character';

@Component({
    selector: 'pan-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
    @Input() public promptStream;
    @Input() public optionsStream;

    public character: Character;

    public inventory = {
        items: []
    };

    public characterGlyph;

    constructor(
        private characterService: CharacterService
    ) {}

    ngOnInit() {
        this.character = this.characterService.getCurrent();

        this.characterService
            .getInventory()
            .subscribe((items: any[]) => {
                this.inventory.items = items;
            });

        this.characterService
            .getCharacters({
                isCacheBust: true
            })
            .subscribe(() => {
                this.character = this.characterService.getCurrent();
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

    public drop(item) {
        const amountPrompt = new Prompt(`how much would you like to put down? (max ${item.count})`);

        amountPrompt
            .answerStream
            .subscribe((amount: string) => {
                const itemQuantity = Number(amount);

                if (itemQuantity < 0 || itemQuantity > item.count) {
                    return;
                }

                item.count -= itemQuantity;

                this.characterService
                    .putDown(item.id, itemQuantity)
                    .subscribe(
                        (response) => {
                            console.log('response: ', response);
                        }
                    );
            });

        this.promptStream.next(amountPrompt);
    }

    public give(item) {
        const amountPrompt = new Prompt(`how much would you like to give? (max ${item.count})`);

        amountPrompt
            .answerStream
            .subscribe((amount: string) => {
                this.characterService
                    .getCharacters({ isCacheBust: true })
                    .subscribe((characters) => {
                        _.forEach(characters, character => {
                            const characterOption = new Option(character.name);

                            characterOption
                                .selectedStream
                                .subscribe(() => {
                                    this.characterService
                                        .giveItem(item.id, amount, character.id)
                                        .subscribe((response) => {
                                            console.log('response: ', response);
                                        });
                                });

                            this.optionsStream.next(characterOption);
                        });
                    });
            });

        this.promptStream.next(amountPrompt);
    }
}
