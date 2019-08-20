import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

import { Option } from '../../option.model';
import { Prompt } from '../../prompt.model';
import { Message } from '../../../models/message.model';

import { CharacterService } from '../../../services/character.service';
import { FarmService } from '../../../services/farm.service';

import * as _ from 'lodash';

@Injectable()
export class FarmingManager {
    private mainFeedStream;
    private optionsStream;
    private promptStream;

    private zoneId: number;

    constructor(
        private characterService: CharacterService,
        private farmService: FarmService
    ) {}

    public init(mainFeedStream, optionsStream, promptStream, parentOption): void {
        this.mainFeedStream = mainFeedStream;
        this.optionsStream = optionsStream;
        this.promptStream = promptStream;

        this.zoneId = this.characterService
            .getCurrent()
            .zoneId;

        const farmingOption = new Option('farming');

        parentOption.setOption(farmingOption);

        farmingOption
            .selectedStream
            .subscribe(() => this.onFarmSelect());
    }

    private onFarmSelect() {
        // TODO - show options more intelligently
        const createOption = new Option('create');

        const ploughOption = new Option('plough');
        ploughOption.isConcat = true;

        const plantOption = new Option('plant');
        plantOption.isConcat = true;

        const tillOption = new Option('till');
        tillOption.isConcat = true;

        const fertilizeOption = new Option('fertilize');
        fertilizeOption.isConcat = true;

        const harvestOption = new Option('harvest');
        harvestOption.isConcat = true;

        createOption
            .selectedStream
            .subscribe(() => {
                this.onCreatePlotSelect();
            });

        ploughOption
            .selectedStream
            .subscribe(() => {
                this.onPloughPlotSelect();
            });

        plantOption
            .selectedStream
            .subscribe(() => {
                this.onPlantPlotSelect();
            });

        tillOption
            .selectedStream
            .subscribe(() => {
                this.onTillPlotSelect();
            });

        fertilizeOption
            .selectedStream
            .subscribe(() => {
                this.onFertilizePlotSelect();
            });

        harvestOption
            .selectedStream
            .subscribe(() => {
                this.onHarvestPlotSelect();
            });

        this.optionsStream.next(createOption);
        this.optionsStream.next(ploughOption);
        this.optionsStream.next(plantOption);
        this.optionsStream.next(tillOption);
        this.optionsStream.next(fertilizeOption);
        this.optionsStream.next(harvestOption);
    }

    private cancelActivity(huntActivity) {
        this.characterService
            .cancelActivity(huntActivity.id)
            .subscribe((response) => {
                console.log('response: ', response);
            });
    }

    private onCreatePlotSelect() {
        // TODO = get item properly
        this.farmService
            .createPlot(5)
            .subscribe((farmActivity) => {
                const cancelFarmOption = new Option('cancel');

                cancelFarmOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(farmActivity));

                this.optionsStream.next(cancelFarmOption);
            });
    }

    private onPloughPlotSelect() {
        // TODO - get item properly
        this.farmService
            .ploughPlot(5)
            .subscribe((farmActivity) => {
                const cancelFarmOption = new Option('cancel');

                cancelFarmOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(farmActivity));

                this.optionsStream.next(cancelFarmOption);
            });
    }

    private onPlantPlotSelect() {
        this.farmService
            .plantPlot(5)
            .subscribe((farmActivity) => {
                const cancelFarmOption = new Option('cancel');

                cancelFarmOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(farmActivity));

                this.optionsStream.next(cancelFarmOption);
            });
    }

    private onTillPlotSelect() {
        this.farmService
            .tillPlot(5)
            .subscribe((farmActivity) => {
                const cancelFarmOption = new Option('cancel');

                cancelFarmOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(farmActivity));

                this.optionsStream.next(cancelFarmOption);
            });
    }

    private onFertilizePlotSelect() {
        this.farmService
            .fertilizePlot(5)
            .subscribe((farmActivity) => {
                const cancelFarmOption = new Option('cancel');

                cancelFarmOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(farmActivity));

                this.optionsStream.next(cancelFarmOption);
            });
    }

    private onHarvestPlotSelect() {
        this.farmService
            .harvestPlot(5)
            .subscribe((farmActivity) => {
                const cancelFarmOption = new Option('cancel');

                cancelFarmOption
                    .selectedStream
                    .subscribe(() => this.cancelActivity(farmActivity));

                this.optionsStream.next(cancelFarmOption);
            });
    }
}
