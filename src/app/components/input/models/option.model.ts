export class Option {

    public name: string;
    public options: Option[];

    constructor(name: string) {
        this.name = name;
    }

    public setOptions(options: Option[]): Option {
        this.options = options;
        return this;
    }
}
