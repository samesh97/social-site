import { Friend } from "./friend.mode";

export class User
{
    id: string = "";
    firstName: string = "";
    lastName: string = "";
    profileUrl: string = "";
    coverUrl: string = "";
    friends: Friend[] = [];
}
