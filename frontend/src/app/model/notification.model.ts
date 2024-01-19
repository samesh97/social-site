import { User } from "./user.model";

export class Notification
{
    id: string = "";
    type: string = "";
    hasSeen: boolean = false;
    createdAt: string = "";
    updatedAt: string = "";
    initiatedUser: User = new User();
    targetId: string = "";
    targetType: string = "";
}