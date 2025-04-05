import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/service/post/post.service';
import { Response } from 'src/app/model/response.model';
import { Post } from 'src/app/model/post.model';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit
{
  public searchText: string = "";
  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private journeyManager: JourneyManagerService,
    private activatedRoute: ActivatedRoute
  )
  { }



  ngOnInit(): void
  {
    this.activatedRoute.data.subscribe((data: any) =>
    {
      this.posts = data.posts.data;
    })
  }

  nameClicked = (profileId: string) =>
  {
    this.journeyManager.loadProfileView(profileId);
  }

  commented = (postId: string) =>
  {
    this.postService.loadComments(postId)
    .subscribe((data: Response) => {
      this.posts.filter(post => post.id == postId)[0].comments = data.data;
    });
  }
}
