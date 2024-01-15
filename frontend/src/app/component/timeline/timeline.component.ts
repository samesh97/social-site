import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/service/post/post.service';
import { Response } from 'src/app/model/response.model';
import { Post } from 'src/app/model/post.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserService } from 'src/app/service/user/user.service';
import { User } from 'src/app/model/user.model';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit
{
  public searchText: string = "";
  constructor(
    private postService: PostService,
    private journeyManager: JourneyManagerService
  )
  { }
  posts: Post[] = [];
  

  ngOnInit(): void
  {
    this.loadPosts();
  }
  loadPosts = () => {
    this.postService.loadPosts().subscribe((data: Response) => {
      const postList = <Post[]>data.data;
      this.posts.push(...postList);
    });
  }
  nameClicked = (profileId: string) =>
  {
    this.journeyManager.loadProfileView(profileId);
  }
  commented = (postId: string) =>
  {
    this.postService.loadComments(postId)
    .subscribe((data: Response) => {
      this.posts.filter(post => post.id == postId)[0].Comments = data.data;
    });
  }
}
