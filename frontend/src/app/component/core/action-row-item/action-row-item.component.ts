import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Friend } from 'src/app/model/friend.mode';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'action-row-item',
  templateUrl: './action-row-item.component.html',
  styleUrls: ['./action-row-item.component.css']
})
export class ActionRowItemComponent {

  @Input() friend: Friend = new Friend();
  @Output() positiveActionListner: EventEmitter<string> = new EventEmitter();
  @Output() negativeActionListner: EventEmitter<string> = new EventEmitter();

  constructor(
    private userService: UserService
  ) { }

  acceptRequest = ( id: string ) =>
  {

    this.positiveActionListner.emit(id);

    // this.userService.acceptOrDenyFriendRequest(this.friend.requestedUserId, true)
    //   .subscribe(data => {
      
    //   });
  }
  denyRequest = ( id: string ) =>
  {
    this.negativeActionListner.emit(id);
    // this.userService.acceptOrDenyFriendRequest(this.friend.requestedUserId, false)
    //   .subscribe(data => {
      
    //   });
  }
}
