import { Component, OnInit } from '@angular/core';
import { LoggedUser } from 'src/app/model/logged-user.model';
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
handle(boolean: boolean) {
throw new Error('Method not implemented.');
}
  public searchText: string = "";
  searchUsers: User[] = [];
  currentUser: LoggedUser = new LoggedUser();
  isNotificationOpen: boolean = false;
  notifications: Notification[] = [];
  isProfileOptionOpen: boolean = false;
  
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
    if ( !this.searchText || this.searchText.trim() == '')
    {
        return;
    }

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
  notificationClick = (event: boolean) =>
  {
    this.isNotificationOpen = event;
  }
  profileClick = (event: boolean) => 
  {
    this.isProfileOptionOpen = event;
  }
  viewCurrentUserProfile = () => 
  {
    this.viewProfile(this.authService.getUserInfo().id);
  }
}
