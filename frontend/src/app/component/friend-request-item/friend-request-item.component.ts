import { Component, Input } from '@angular/core';
import { Friend } from 'src/app/model/Friend.mode';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-friend-request-item',
  templateUrl: './friend-request-item.component.html',
  styleUrls: ['./friend-request-item.component.css']
})
export class FriendRequestItemComponent {

  @Input()
  friend: Friend = new Friend();

  constructor(
    private userService: UserService
  ) { }

  acceptRequest = () =>
  {
    this.userService.acceptOrDenyFriendRequest(this.friend.requestedUserId, true)
      .subscribe(data => {
      
      });
  }
  denyRequest = () =>
  {
    this.userService.acceptOrDenyFriendRequest(this.friend.requestedUserId, false)
      .subscribe(data => {
      
      });
  }
}
