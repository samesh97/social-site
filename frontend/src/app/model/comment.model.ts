import { User } from "./user.model";

export class Comment
{
    id: string = "";
    comment: string = "";
    userId: string = "";
    postId: string = "";
    user: User = new User();
    createdAt: string = "";
    updatedAt: string = "";
}
