import { Component } from '@angular/core';
import { Post } from 'src/app/model/post.model';
import { Response } from 'src/app/model/response.model';
import { PostService } from 'src/app/service/post/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  post = new Post();
  constructor(private postService: PostService) { }
  createPost = () => {
    this.postService.createPost(this.post)
      .subscribe((data: Response) => {
        console.log(data);
      });
  }
}
