import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from 'src/app/model/comment.model';
import { PostImage } from 'src/app/model/post-image.model';
import { Post } from 'src/app/model/post.model';
import { Reaction } from 'src/app/model/reaction.model';
import { Response } from 'src/app/model/response.model';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { PostService } from 'src/app/service/post/post.service';

@Component({
  selector: 'user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.css'],
})
export class UserPostComponent
{
  @Input() isEditable = false;
  @Input() isInteractable = true;
  @Input() isCommentable = false;

  @Input() postId: string = "";
  @Input() userId: string = "";
  @Input() username: string = "";
  @Input() profileImage: string = "";
  @Input() date: string = "";
  @Input() description: string = "";
  @Input() images: PostImage[] = [];
  @Input() reactions: Reaction[] = [];
  @Input() comments: Comment[] = [];

  @Output() onImageClick = new EventEmitter<PostImage>();
  @Output() onComment = new EventEmitter<string>();
  @Output() onNameClick = new EventEmitter<string>();
  @Output() onDescriptionChange = new EventEmitter<string>();

  constructor() { }

  nameClicked = () =>
  {
    if (this.isInteractable) 
    {
      this.onNameClick.emit(this.userId);
    }
  }
  commentPosted = (postId: string) =>
  {
    if (this.isInteractable)
    {
      this.onComment.emit(postId);  
    }
  }
  imageClick = (postImage: PostImage) =>
  {
    if (this.isInteractable)
    {
      this.onImageClick.emit(postImage);
    }
  }
  descriptionChanged = () =>
  {
    this.onDescriptionChange.emit(this.description);
  }
}
