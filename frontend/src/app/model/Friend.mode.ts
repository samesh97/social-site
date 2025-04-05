import { User } from "./user.model";

export class Friend
{
    requestedUser: User = new User();
    acceptedUser: User = new User();
    accepted: boolean = false;
    createdAt: string = "";
    updatedAt: string = "";
}
