import { User } from "./user.model";

export class Comment
{
    id: string = "";
    comment: string = "";
    userId: string = "";
    postId: string = "";
    User: User = new User();
}