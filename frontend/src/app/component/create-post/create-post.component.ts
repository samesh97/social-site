import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/model/post.model';
import { Response } from 'src/app/model/response.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PostService } from 'src/app/service/post/post.service';
import { ProgressService } from 'src/app/service/progress/progress.service';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { LoggedUser } from 'src/app/model/logged-user.model';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit
{
  post = new Post();
  images: any[] = [];
  currentUser: LoggedUser = new LoggedUser();

  constructor(
    private postService: PostService,
    private progressService: ProgressService,
    private authService: AuthService,
    private matDialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.currentUser = this.authService.getUserInfo();
  }

  createPost = () =>
  {
    this.progressService.show();
    const formData = new FormData();
    formData.append("description", this.post.description);
    for (let image of this.images)
    {
      formData.append("post-images", image);    
    }
  
    this.postService.createPost(formData)
      .subscribe((data: Response) => {
        this.progressService.hide();
    });
  }
  imageSelected = (event: any) =>
  {
    if (event.target.files && event.target.files[0])
    {
      this.images.push(event.target.files[0]);  
    }
  }
  openPostDialog = () => 
  {
    this.matDialog.open(CreatePostDialogComponent, {panelClass: 'custom-modalbox'});
  }
}
