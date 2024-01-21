import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/model/notification.model';
import { Response } from 'src/app/model/response.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'main',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit
{
  public searchText: string = "";
  searchUsers: User[] = [];
  currentUser: User = new User();
  isNotificationOpen: boolean = false;
  notifications: Notification[] = [];
  
  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private journeyManager: JourneyManagerService,
    private notificationService: NotificationService
  )
  {
    this.currentUser = this.authService.getUserInfo();
  }
  
  ngOnInit(): void
  {
    this.loadNotifications();
  }
  search()
  {
    this.userService.search(this.searchText).subscribe(data => {
      this.searchUsers = data.data;
    });
  }
  viewProfile = (id: string) =>
  {
    this.journeyManager.loadProfileView(id);
  }
  logout = () =>
  {
    this.authService.logout().subscribe(data => {
      this.authService.setLoggedIn(false);
    });  
  }
  navigateHome = () =>
  {
    this.journeyManager.loadHome();
  }
  loadNotifications = () => {
    this.notificationService.loadNotifications()
      .subscribe((res: Response) => {
        this.notifications = res.data;
      });
  }
  notificationClick = () => {
    this.isNotificationOpen = !this.isNotificationOpen;
  }
}
