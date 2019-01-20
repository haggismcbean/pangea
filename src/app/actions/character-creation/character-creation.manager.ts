import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject, Observable, of, pipe } from 'rxjs';

import { Option } from '../option.model';
import { Prompt } from '../prompt.model';
import { Message } from '../../models/message.model';

import { CharacterService } from '../../services/character.service';

@Injectable()
export class CharacterCreationManager {
    public characterCreatedStream;

    private mainFeedStream;
    private optionsStream;
    private promptStream;

    constructor(
        private characterService: CharacterService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream): void {
        this.characterCreatedStream = new Subject();

        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.sendMessage('Application received', 'system');
        this.sendMessage('Loading applicant data', 'system');

        // load a randomly generated user.
        this.characterService
            .create()
            .subscribe((character) => {
                this.sendMessage('Name: ' + character.name, 'system');

                this.sendMessage('Appearance:', 'system');
                this.sendMessage(character.appearance, 'system');

                this.sendMessage('Traits:', 'system');
                this.sendMessage(character.personality, 'system');

                this.sendMessage('Bio:', 'system');
                this.sendMessage(character.backstory, 'system');

                const confirmPrompt = new Prompt('Confirm details (y/n)');

                confirmPrompt
                    .answerStream
                    .subscribe((confirmation: string) => {
                        console.log('dude, he confirmed alright');

                        if (confirmation === 'y') {
                            console.log('alerting subscriptions...');
                            this.characterCreatedStream.next(character);
                        }
                    });

                this.promptStream.next(confirmPrompt);
            });
    }

    private sendMessage(messageText: string, messageClass: string): void {
        const message = new Message(0);
        message.setText(messageText);
        message.setClass(messageClass);

        this.mainFeedStream.next(message);
    }
}
