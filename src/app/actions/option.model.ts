export class Option {

    public name: string;
    public options: Option[];
    public onOptionSelected;

    constructor(name: string) {
        this.name = name;
    }

    public setOptions(options: Option[]): Option {
        this.options = options;
        return this;
    }

    public setSelectedCallback(onOptionSelected): Option {
        this.onOptionSelected = onOptionSelected;
        return this;
    }
}
