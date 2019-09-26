import * as _ from 'lodash';

import { Option } from '../../../actions/option.model';

export class OptionsTree {

    public currentOptions: Option[];
    public selectedOptions: Option[];
    public originalOptions: Option[];

    constructor(options) {
        this.currentOptions = options;
        this.selectedOptions = [];
    }

    public setOriginalOptions(options) {
        this.originalOptions = options;
    }

    public setCurrentOptions(options) {
        this.currentOptions = options;
    }

    public selectOption(option) {
        this.selectedOptions.push(option);

        if (option.options) {
            this.currentOptions = option.options;
        } else {
            this.currentOptions = undefined;
        }
    }

    public clearSelectedOptions() {
        this.selectedOptions = [];
    }

    public removeLastSelectedOption(input) {
        if (_.last(this.selectedOptions) && input.indexOf(_.last(this.selectedOptions).name) === -1) {
            const previousOptions = this.selectedOptions.pop();

            if (this.selectedOptions.length === 0) {
                this.setCurrentOptions(this.originalOptions);
            } else {
                this.setCurrentOptions(_.last(this.selectedOptions).options);
            }
        }
    }

    public getHintedOption(input) {
        const clippedInput = this.clipOptionsInput(input);

        const option = _.find(this.currentOptions, function(_option) {
            return _.startsWith(_option.name, clippedInput);
        });

        return option;
    }

    public clipOptionsInput(input) {
        let accountedForInput = '';

        for (let i = 0; i < this.selectedOptions.length; i++) {
            accountedForInput += this.selectedOptions[i].name + ' ';
        }

        return _.replace(input, accountedForInput, '');
    }
}
