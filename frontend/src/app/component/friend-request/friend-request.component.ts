import { Component, OnInit } from '@angular/core';
import { Friend } from 'src/app/model/Friend.mode';
import { Response } from 'src/app/model/response.model';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit {
  requests: Friend[] = [];

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void
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
