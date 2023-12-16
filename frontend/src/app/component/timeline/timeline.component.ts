import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/service/post/post.service';
import { Response } from 'src/app/model/response.model';
import { Post } from 'src/app/model/post.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserService } from 'src/app/service/user/user.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit
{
  public searchText: string = "";
  constructor(private postService: PostService) { }
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
}
