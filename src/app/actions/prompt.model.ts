export class Prompt {

    public name: string;
    public onPromptAnswered;

    constructor(name: string) {
        this.name = name;
    }

    public setAnsweredCallback(onPromptAnswered): Prompt {
        this.onPromptAnswered = onPromptAnswered;
        return this;
    }
}
