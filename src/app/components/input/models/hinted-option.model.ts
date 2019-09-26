import * as _ from 'lodash';

import { Option } from '../../../actions/option.model';

export class HintedOption {

	public option: Option;
	public options: Option[]
	public text: string;

    constructor(option) {
        this.option = option;
        this.options = option.options;
    }

    public calculateHintText (clippedInput) {
    	this.text = _.replace(this.option.name, clippedInput, '');
    	return this.text;
    }
}
