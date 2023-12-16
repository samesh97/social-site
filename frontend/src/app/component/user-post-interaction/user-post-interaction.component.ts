import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from 'src/app/model/post.model';
import { Reaction } from 'src/app/model/reaction.model';
import { Comment } from 'src/app/model/comment.model';
import { PostService } from 'src/app/service/post/post.service';

@Component({
  selector: 'app-user-post-interaction',
  templateUrl: './user-post-interaction.component.html',
  styleUrls: ['./user-post-interaction.component.css']
})
export class UserPostInteractionComponent {

  public isCommentable: boolean = false;
  public commentText: string = "";
  @Input() post: Post = new Post();

  @Output() commentEmitter = new EventEmitter<string>();

  public constructor(private postService:PostService){}

  showOrHideCommentInput = () =>
  {
    this.isCommentable = !this.isCommentable;  
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
        this.commentEmitter.emit(this.post.id);
    });
    
  }
  react = (type: string) => {
    const reaction = new Reaction();
    reaction.type = type;
    reaction.postId = this.post.id;
    this.postService.react(reaction).subscribe(data => {})
  }
}
