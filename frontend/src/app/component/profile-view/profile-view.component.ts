import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit
{
  private profileId: string = "";
  public posts: Post[] = [];
  public user: User = new User();
  public constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private authSerice: AuthService) { }
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.profileId = params['id'];
      this.loadProfile();
    });
  }
  loadProfile = () => 
  {
    this.userService.viewProfile(this.profileId).subscribe(data => {
      this.posts = data.data.Posts;
      this.user = data.data;
    });
  }
  addFriend = () =>
  {
    this.userService.addFriend(this.user.id, this.authSerice.getUserInfo().id)
      .subscribe(data => {
        console.log(data);
    })
  }
}
