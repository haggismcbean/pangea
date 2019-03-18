import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';

import * as _ from 'lodash';

@Injectable()
export class MovementManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        const moveToOption = new Option('move to');

        const northOption = new Option('north');
        const eastOption = new Option('east');
        const southOption = new Option('south');
        const westOption = new Option('west');

        moveToOption.setOptions([northOption, eastOption, southOption, westOption]);

        northOption
            .selectedStream
            .subscribe(() => {
                console.log('move north');
            });

        eastOption
            .selectedStream
            .subscribe(() => {
                console.log('move north');
            });

        southOption
            .selectedStream
            .subscribe(() => {
                console.log('move north');
            });

        westOption
            .selectedStream
            .subscribe(() => {
                console.log('move north');
            });

        this.optionsStream.next(moveToOption);
    }
}
