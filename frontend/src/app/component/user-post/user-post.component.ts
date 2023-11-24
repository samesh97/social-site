import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/model/comment.model';
import { Post } from 'src/app/model/post.model';
import { Reaction } from 'src/app/model/reaction.model';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { PostService } from 'src/app/service/post/post.service';

@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.css'],
})
export class UserPostComponent {

  @Input() post: Post = new Post();

  constructor(private journeyManager: JourneyManagerService) { }

  nameClicked = () =>
  {
    this.journeyManager.loadProfileView(this.post.User.id);
  }
}
