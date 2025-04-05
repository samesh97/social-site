import { Post } from "./post.model";
import { User } from "./user.model";

export class Reaction {
    id: string = "";
    type: string = "";
    postId: string = "";
    userId: string = "";
    post: Post = new Post();
    user: User = new User();
    createdAt: string = "";
    updatedAt: string = "";
}
