import { User } from "./user.model";

export class Friend
{
    requestedUserId: string = "";
    acceptedUserId: string = "";
    requestedUser: User = new User();
    acceptedUser: User = new User();
    isAccepted: boolean = false;
    createdAt: string = "";
    updatedAt: string = "";
}