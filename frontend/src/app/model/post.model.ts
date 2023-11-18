import { Comment } from "./comment.model";
import { Reaction } from "./reaction.model";
import { User } from "./user.model";

export class Post {
    id: string = "";
    description: string = "";
    Comments: Comment[] = [];
    Reactions: Reaction[] = [];
    User: User = new User();
}