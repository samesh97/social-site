import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/model/comment.model';
import { Post } from 'src/app/model/post.model';
import { Reaction } from 'src/app/model/reaction.model';
import { PostService } from 'src/app/service/post/post.service';

@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.css'],
})
export class UserPostComponent {

  @Input() post: Post = new Post();

  public commentText: string = "";

  constructor(private postService: PostService) { }

  react = (type: string) => {
    const reaction = new Reaction();
    reaction.type = type;
    reaction.postId = this.post.id;
    this.postService.react(reaction).subscribe(data => {
      console.log(data);
    })
  }
  comment()
  {
    if (this.commentText == "")
    {
      return;
    }
    const comment = new Comment();
    comment.comment = this.commentText;
    comment.postId = this.post.id;
    this.postService.comment(comment)
      .subscribe(data => {
        this.commentText = "";
    });
  }
}