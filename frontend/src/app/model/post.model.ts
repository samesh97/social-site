import { Comment } from "./comment.model";
import { Reaction } from "./reaction.model";

export class Post {
    id: string = "";
    description: string = "";
    Comments: Comment[] = [];
    Reactions: Reaction[] = [];
}