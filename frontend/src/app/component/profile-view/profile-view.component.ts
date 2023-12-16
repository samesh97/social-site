import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit
{
  private profileId: string = "";
  public posts: Post[] = [];
  public user: User = new User();
  private currentUser: User = new User();

  public friendActionBtnStatusIndex = 4;
  public friendActionBtnStatus = ['Add friend','Unfriend','Accept','Remove','Loading'];

  public constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authSerice: AuthService
  ){ }
  
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
      this.setCurrentUser();
    });
  }
  performBtnClick = () =>
  {
    this.userService.addFriend(this.user.id)
      .subscribe(data => {
        this.loadProfile();
      });
  }
  setCurrentUser = () =>
  {
    this.currentUser = this.authSerice.getUserInfo();
    this.setFriendBtnStatus();
  }
  setFriendBtnStatus = () =>
  {
    console.log(this.user.Friends);
    const friend = this.user.Friends.filter(frd => frd.requestedUserId == this.currentUser.id || frd.acceptedUserId== this.currentUser.id)[0];
    if (!friend)
    {
      this.friendActionBtnStatusIndex = 0;
      return;
    }
    if (friend.isAccepted)
    {
      this.friendActionBtnStatusIndex = 1;
      return;
    }
    if(friend.acceptedUserId == this.currentUser.id)
    {
      this.friendActionBtnStatusIndex = 2;
      return;
    }
    if (friend.requestedUserId == this.currentUser.id)
    {
      this.friendActionBtnStatusIndex = 3;
      return;
    }
  }
}
