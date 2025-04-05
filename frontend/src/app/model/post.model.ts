import { Comment } from "./comment.model";
import { PostImage } from "./post-image.model";
import { Reaction } from "./reaction.model";
import { User } from "./user.model";

export class Post {
    id: string = "";
    description: string = "";
    comments: Comment[] = [];
    reactions: Reaction[] = [];
    user: User = new User();
    postImages: PostImage[] = [];
    createdAt: string = new Date().toUTCString();
    updatedAt: string = new Date().toUTCString();
}
