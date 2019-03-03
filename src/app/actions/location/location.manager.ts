import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';
import { Character } from '../../models/character.model';

@Injectable()
export class LocationManager {
    private email: string;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    constructor(
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        const lookAtOption = new Option('look at');

        const peopleOption = new Option('people');
        const plantsOption = new Option('plants');
        const animalsOption = new Option('animals');
        const toolsOption = new Option('tools');

        lookAtOption.setOptions([peopleOption, plantsOption, animalsOption, toolsOption]);

        peopleOption
            .selectedStream
            .subscribe(() => {
                console.log('people selected!');
            });

        plantsOption
            .selectedStream
            .subscribe(() => {
                console.log('plantsOption selected!');
            });

        animalsOption
            .selectedStream
            .subscribe(() => {
                console.log('animalsOption selected!');
            });

        toolsOption
            .selectedStream
            .subscribe(() => {
                console.log('toolsOption selected!');
            });

        this.optionsStream.next(lookAtOption);
    }
}
