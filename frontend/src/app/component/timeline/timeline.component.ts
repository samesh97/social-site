import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/service/post/post.service';
import { Response } from 'src/app/model/response.model';
import { Post } from 'src/app/model/post.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {

  constructor(private postService: PostService) {}
  posts: Post[] = [];

  ngOnInit(): void {
    this.postService.loadPosts().subscribe((data: Response) => {
        const postList = <Post[]> data.data;
        this.posts.push(...postList);
    });
  }
}
