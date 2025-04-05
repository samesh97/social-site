import { Component, OnInit } from '@angular/core';
import { Friend } from 'src/app/model/friend.mode';
import { Response } from 'src/app/model/response.model';
import { ToastService } from 'src/app/service/toast/toast.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit {
  requests: Friend[] = [];

  constructor
  (
    private userService: UserService,
    private toastService: ToastService
  )
  { }

  ngOnInit(): void
  {
      this.loadRequests();
  }

  handleEvent = (id: string, accept: boolean) =>
  {
    this.userService.acceptOrDenyFriendRequest(id, accept).subscribe((response: Response) =>
    {
      if (response.code == 201)
      {
        this.toastService.showToast(`Request was ${accept ? 'accepted' : 'denied'}.`);
        this.loadRequests();
      }
    });
  }

  private loadRequests = () =>
  {
    this.userService.getFriendRequests()
      .subscribe((data: Response) => {
        if (data.code == 200)
        {
          this.requests = data.data;
        }
      });
  }
}
