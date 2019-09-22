import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { ZoneService } from '../../../services/zone.service';
import { MineService } from '../../../services/mine.service';

import * as _ from 'lodash';

@Injectable()
export class MiningManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private mineService: MineService,
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const miningOption = new Option('mining');

        parentOption.setOption(miningOption);

        miningOption
            .selectedStream
            .subscribe(() => this.onMineSelect());
    }

    private onMineSelect() {
        const createOption = new Option('create');

        const mineOption = new Option('mine');
        mineOption.isConcat = true;

        const reinforceOption = new Option('reinforce');
        reinforceOption.isConcat = true;

        createOption
            .selectedStream
            .subscribe(() => {
                this.onCreateMineSelect();
            });

        mineOption
            .selectedStream
            .subscribe(() => {
                this.onMineMineSelect();
            });

        reinforceOption
            .selectedStream
            .subscribe(() => {
                this.onReinforceMineSelect();
            });

        this.optionsStream.next(createOption);
        this.optionsStream.next(mineOption);
        this.optionsStream.next(reinforceOption);
    }

    private onCreateMineSelect() {
        this.mineService
            .createMine()
            .subscribe((mineActivity) => {
                console.log('creating mine: ', mineActivity);
            }, (response) => {
                const error = new Message(0);
                error.setText(response.error.message);
                error.setClass('error-notification');

                this.mainFeedStream.next(error);
            });
    }

    private onMineMineSelect() {
        this.mineService
            .getAccessibleStones()
            .subscribe((stones) => {
                _.forEach(stones, (stone) => {
                    const stoneOption = new Option(stone.name);

                    stoneOption
                        .selectedStream
                        .subscribe(() => {
                            this.mineService
                                .mineMine({
                                    itemId: stone.item_id,
                                    itemType: stone.item_type
                                })
                                .subscribe((mineActivity) => {
                                    console.log('you did something!', mineActivity);
                                }, (response) => {
                                    const error = new Message(0);
                                    error.setText(response.error.message);
                                    error.setClass('error-notification');

                                    this.mainFeedStream.next(error);
                                });
                        });

                    this.optionsStream.next(stoneOption);
                });
            });
    }

    private onReinforceMineSelect() {
        this.mineService
            .reinforceMine()
            .subscribe((mineActivity) => {
                console.log('reinforcing mine: ', mineActivity);
            }, (response) => {
                const error = new Message(0);
                error.setText(response.error.message);
                error.setClass('error-notification');

                this.mainFeedStream.next(error);
            });
    }
}
