import { Component, OnChanges, Input } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { PlantService } from '../../services/plant.service';
import { CharacterService } from '../../services/character.service';

import { Character } from '../../models/character.model';
import { Prompt } from '../../actions/prompt.model';
import { Option } from '../../actions/option.model';

import * as _ from 'lodash';

@Component({
    selector: 'pan-crafting',
    templateUrl: './crafting.component.html',
    styleUrls: ['./crafting.component.scss']
})
export class CraftingComponent implements OnChanges {
    @Input() public character: Character;
    @Input() public promptStream;
    @Input() public optionsStream;

    constructor(
        private zoneService: ZoneService,
        private plantService: PlantService,
        private characterService: CharacterService
    ) {
    }

    ngOnChanges(changes) {
        if (changes.character && this.character) {
            this.getCraftables();
        }
    }

    private getCraftables() {
    }

}
