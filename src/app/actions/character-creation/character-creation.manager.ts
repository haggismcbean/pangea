import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

        // load a randomly generated character.
        this.characterService
            .create()
            .subscribe((character) => {
                const source = {
                    id: 0,
                    name: 'system'
                };

                this.sendMessage('Name: ' + character.name, source);

                this.sendMessage('Appearance:', source);
                this.sendMessage(character.appearance, source);

                this.sendMessage('Traits:', source);
                this.sendMessage(character.personality, source);

                this.sendMessage('Bio:', source);
                this.sendMessage(character.backstory, source);

                this.sendPrompt('Confirm details (y/n)', character);
            });
    }

    private sendMessage(messageText: string, source: any): void {
        const message = new Message(0);
        message.setText(messageText);
        message.setSource(source);
        message.setDate(Date.now());

        this.mainFeedStream.next(message);
    }

    private sendPrompt(promptText: string, character) {
        const confirmPrompt = new Prompt(promptText);

        confirmPrompt
            .answerStream
            .subscribe((confirmation: string) => {

                if (confirmation === 'y') {
                    this.characterCreatedStream.next(character);
                }
            });

        this.promptStream.next(confirmPrompt);
    }
}
