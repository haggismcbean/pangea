export class Character {

    public appearance: string;
    public backstory: string;
    public personality: string;
    public birthday: string;
    public createdAt: string;
    public forename: string;
    public gender: string;
    public height: number;
    public id: number;
    public name: string;
    public posessivePronoun: string;
    public pronoun: string;
    public strength: number;
    public surname: string;
    public updatedAt: string;
    public userId: number;
    public weight: number;
    public zoneId: number;
    public isDead: boolean;
    public health: number;
    public hunger: number;
    public exposure: number;

    constructor(id: number) {
        this.id = id;
    }
}
