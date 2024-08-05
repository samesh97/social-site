import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggedUser } from 'src/app/model/logged-user.model';
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
  private currentUser: LoggedUser = new LoggedUser();

  // public friendActionBtnStatusIndex = 4;
  // public friendActionBtnStatus = ['Add friend','Unfriend','Accept','Remove','Loading'];

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
  setFriendBtnStatus = (): string =>
  {
    const friend = this.user.Friends.filter(frd => frd.requestedUserId == this.currentUser.id || frd.acceptedUserId == this.currentUser.id)[0];
    if (!friend)
    {
        return 'Add friend';
    }
    if (friend.isAccepted)
    {
        return 'Unfriend';
    }
    if(friend.acceptedUserId == this.currentUser.id)
    {
        return 'Accept';
    }
    if (friend.requestedUserId == this.currentUser.id)
    {
        return 'Remove';
    }
    return '';
  }
  isOwnAccount = (): boolean => {
    const user = this.authSerice.getUserInfo();
    return !(this.authSerice.hasLoggedIn() && this.profileId === user.id)
  }
}
