import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PostImage } from 'src/app/model/post-image.model';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PostService } from 'src/app/service/post/post.service';
import { ProgressService } from 'src/app/service/progress/progress.service';

@Component({
  selector: 'create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.css'],
})
export class CreatePostDialogComponent implements OnInit
{
  post: Post = new Post();
  selectedImageList: any[] = [];

  constructor(
    private authService: AuthService,
    private progressService: ProgressService,
    private postService: PostService,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>
  )
  { }

  ngOnInit(): void
  {
    let loggedUser = this.authService.getUserInfo();
    let user = new User();
    user.id = loggedUser.id;
    user.firstName = loggedUser.firstName;
    user.lastName = loggedUser.lastName;
    user.profileUrl = loggedUser.profileUrl;
    this.post.user = user;
  }
  imageClicked = (postImage: PostImage) =>
  {

  }
  imageSelected = (event: any) =>
  {
    if (event.target.files && event.target.files[0])
    {
      this.addImageToPost(event.target.files[0]);
    }
  }
  onDescriptionChange = (desc: string) =>
  {
    this.post.description = desc;
  }
  private addImageToPost = (file: any) =>
  {
    this.selectedImageList.push(file);
    const imageUrl = URL.createObjectURL(file);
    const postImage = new PostImage();
    postImage.imageUrl = imageUrl;
    this.post.postImages.push(postImage);
  }
  createPost = () =>
  {
    this.progressService.show();
    const formData = new FormData();
    formData.append("description", this.post.description);
    for (let image of this.selectedImageList)
    {
      formData.append("postImages", image);
    }

    this.postService.createPost(formData)
    .subscribe(() =>
    {
      this.dialogRef.close();
      this.progressService.hide();
    });
  }
}

