export class Character {

    public appearance: string;
    public backstory: string;
    public personality: string;
    public birthday: string;
    public created_at: string;
    public forename: string;
    public gender: string;
    public height: number;
    public id: number;
    public name: string;
    public posessivePronoun: string;
    public pronoun: string;
    public strength: number;
    public surname: string;
    public updated_at: string;
    public user_id: number;
    public weight: number;

    constructor(id: number) {
        this.id = id;
    }
}
