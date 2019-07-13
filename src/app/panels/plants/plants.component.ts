import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { PlantService } from '../../services/plant.service';
import { CharacterService } from '../../services/character.service';

import { Character } from '../../models/character.model';
import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';

import * as _ from 'lodash';

@Component({
    selector: 'pan-plants',
    templateUrl: './plants.component.html',
    styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit, OnChanges {
    @Input() public character: Character;
    @Input() public promptStream;
    @Input() public optionsStream;

    public plantGroups;
    public groupedPlants;

    private zoneId;

    constructor(
        private zoneService: ZoneService,
        private plantService: PlantService,
        private characterService: CharacterService
    ) {
    }

    ngOnChanges(changes) {
        if (changes.character && this.character) {
            this.zoneService
                .getZonePlants(this.character.zoneId)
                .subscribe((plants: any[]) => {
                    console.log(plants);

                    // okay so first we split them into different types
                    const groupedPlants = _.groupBy(plants, plant => plant.typeName);

                    console.log(groupedPlants);
                    this.plantGroups = Object.keys(groupedPlants);
                    this.groupedPlants = groupedPlants;
                });
        }
    }

    public isShowing(plant) {
        return plant === this.showingPlant;
    }

    public name(plant) {
        // do a prompt!
        this.sendPrompt('Enter plant name', plant);
    }

    private sendPrompt(promptText: string, plant) {
        const plantPrompt = new Prompt(promptText);

        plantPrompt
            .answerStream
            .subscribe((name: string) => {
                this.plantService
                    .name(plant, name)
                    .subscribe();
            });

        this.promptStream.next(plantPrompt);
    }

    public share() {
        // have to choose user/s somehow
    }
}
