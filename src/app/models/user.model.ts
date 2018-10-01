export class User {

    public id: number;
    public token: string;
    public email: string;
    public name: string;

    constructor(id: number) {
        this.id = id;
    }

    public setToken(token: string): User {
        this.token =  token;
        return this;
    }

    public setEmail(email: string): User {
        this.email = email;
        return this;
    }

    public setName(name: string): User {
        this.name = name;
        return this;
    }
}
