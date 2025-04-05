import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/model/post.model';
import { Reaction } from 'src/app/model/reaction.model';
import { Comment } from 'src/app/model/comment.model';
import { PostService } from 'src/app/service/post/post.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { ExpandableRow } from 'src/app/model/expandable-row.model';
import { LoggedUser } from 'src/app/model/logged-user.model';

@Component({
  selector: 'user-post-interaction',
  templateUrl: './user-post-interaction.component.html',
  styleUrls: ['./user-post-interaction.component.css']
})
export class UserPostInteractionComponent implements OnInit{

  public commentText: string = "";
  public isLiked = false;
  public userInfo: LoggedUser = new LoggedUser();


  @Input() isInteractable: boolean = true;
  @Input() isCommentable: boolean = true;
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
    this.userInfo = this.authService.getUserInfo();
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
    comment.userId = this.userInfo.id;

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
    reaction.userId = this.userInfo.id;

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
    if (this.reactions)
    {
      this.isLiked = this.reactions.some(reaction => reaction.user.id == this.userInfo.id);
    }
  }
  getNumberOfComments = () => {
    return this.comments.length;
  }
  getLikeCount = (): number =>
  {
    if (this.reactions)
    {
      return this.reactions.length;
    }
    return 0;
  }
  nameClicked(profileId: string)
  {
    if (this.isInteractable)
    {
      this.journeyManager.loadProfileView(profileId);
    }
  }
  mapToExpandableRows = ( comments: Comment[] ): ExpandableRow[] =>
  {
    return comments.map((comment: Comment) =>
    {
      let expandableRow = new ExpandableRow();
      expandableRow.id = comment.user.id;
      expandableRow.date = comment.updatedAt;
      expandableRow.imageUrl = comment.user.profileUrl;
      expandableRow.mainText = `${comment.user.firstName} ${comment.user.lastName}`;
      expandableRow.subText = comment.comment;
      return expandableRow;
    })
  }
  getCommentsLength = (comments:any):number =>
  {
    if (comments)
    {
      return comments.length;
    }
    return 0;
  }
}
