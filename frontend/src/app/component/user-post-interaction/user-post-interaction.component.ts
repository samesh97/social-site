import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/model/post.model';
import { Reaction } from 'src/app/model/reaction.model';
import { Comment } from 'src/app/model/comment.model';
import { PostService } from 'src/app/service/post/post.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';

@Component({
  selector: 'user-post-interaction',
  templateUrl: './user-post-interaction.component.html',
  styleUrls: ['./user-post-interaction.component.css']
})
export class UserPostInteractionComponent implements OnInit{


  public isCommentable: boolean = false;
  public commentText: string = "";
  public isLiked = false;


  @Input() isInteractable: boolean = true;
  @Input() postId: string = "";
  @Input() comments: Comment[] = [];
  @Input() reactions: Reaction[] = [];

  @Output() commentListner = new EventEmitter<string>();

  public constructor(
    private postService: PostService,
    private authService: AuthService,
    private journeyManager: JourneyManagerService)
  { 
    
  }
  ngOnInit(): void {
    this.isLikedByUser();
  }

  showOrHideCommentInput = () =>
  {
    if (this.isInteractable)
    {
      this.isCommentable = !this.isCommentable;    
    }
  }
  comment()
  {
    if (!this.isInteractable)
    {
      return;  
    }
    if (this.commentText == "")
    {
      return;
    }
    const comment = new Comment();
    comment.comment = this.commentText;
    comment.postId = this.postId;

    this.postService.comment(comment)
      .subscribe(data => {
        this.commentText = "";
        this.commentListner.emit(this.postId);
    });
    
  }
  react = (type: string) => {

    if (!this.isInteractable)
    {
      return;  
    }

    this.isLiked = !this.isLiked;
    const reaction = new Reaction();
    reaction.type = type;
    reaction.postId = this.postId;
    
    if (this.isLiked)
    {
      this.reactions.push(new Reaction()); 
    }
    else
    {
      this.reactions.pop();
    }
    this.postService.react(reaction).subscribe(data => { });
  }
  isLikedByUser = () =>
  {
    const userInfo = this.authService.getUserInfo();
    this.isLiked = this.reactions.some(reaction => reaction.userId == userInfo.id);  
  }
  getNumberOfComments = () => {
    return this.comments.length;
  }
  getLikeCount = (): number => {
    return this.reactions.length;
  }
  nameClicked(profileId: string) {
    if (this.isInteractable)
    {
      this.journeyManager.loadProfileView(profileId);  
    }
  }
}
