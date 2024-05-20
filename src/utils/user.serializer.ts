import { Exclude } from "class-transformer";

export class UserSerializer {
    id: number;
    email: string;
    name: string;
    age: number;
    access_token: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserSerializer>) {
        Object.assign(this, partial);
    }
}