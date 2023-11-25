import { Friend } from "./Friend.mode";

export class User
{
    id: string = "";
    firstName: string = "";
    lastName: string = "";
    profileUrl: string = "assets/images/default-profile-pic.png";
    Friends: Friend[] = [];
}