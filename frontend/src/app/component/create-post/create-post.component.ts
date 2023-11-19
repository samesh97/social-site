import { Component } from '@angular/core';
import { Post } from 'src/app/model/post.model';
import { Response } from 'src/app/model/response.model';
import { PostService } from 'src/app/service/post/post.service';
import { ProgressService } from 'src/app/service/progress/progress.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent
{
  post = new Post();
  images: any[] = [];
  constructor(
    private postService: PostService,
    private progressService: ProgressService
  ) { }

  createPost = () =>
  {
    this.progressService.show();
    const formData = new FormData();
    formData.append("description", this.post.description);
    for (let image of this.images)
    {
      formData.append("post-images", image);    
    }
  

    console.log(this.images);
    this.postService.createPost(formData)
      .subscribe((data: Response) => {
        this.progressService.hide();
    });
  }
  imageSelected = (event: any) =>
  {
    if (event.target.files && event.target.files[0])
    {
      console.log("A file is pushed")
      this.images.push(event.target.files[0]);  
    }
  }
}
