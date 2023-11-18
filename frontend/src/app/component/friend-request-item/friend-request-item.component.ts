import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-friend-request-item',
  templateUrl: './friend-request-item.component.html',
  styleUrls: ['./friend-request-item.component.css']
})
export class FriendRequestItemComponent {

  @Input()
  friend: any = undefined;
}
