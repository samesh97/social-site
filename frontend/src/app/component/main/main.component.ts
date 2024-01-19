import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/model/notification.model';
import { Response } from 'src/app/model/response.model';
import { Toast } from 'src/app/model/toast.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { ProgressService } from 'src/app/service/progress/progress.service';
import { ToastService } from 'src/app/service/toast/toast.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit
{
  public searchText: string = "";
  searchUsers: User[] = [];
  isLoggedIn: boolean = false;
  showProgress: boolean = false;
  currentUser: User = new User();
  public toastList: Toast[] = [];
  isNotificationOpen: boolean = false;
  notifications: Notification[] = [];
  
  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private journeyManager: JourneyManagerService,
    private progressService: ProgressService,
    private toastService: ToastService,
    private notificationService: NotificationService
  )
  {
    this.authService.loginChangeListener().subscribe(isLogin => {
      this.isLoggedIn = isLogin;
      if(isLogin)
      {
        this.journeyManager.loadHome();
      }
      else
      {
        this.journeyManager.loadLogin();
      }
      this.currentUser = this.authService.getUserInfo();
    }); 

    this.toastService.getToastSubject()
      .subscribe(toast => {
        this.toastList.push(toast);
      });
  }
  
  ngOnInit(): void
  {
    this.loginState();
    this.progressStatus();
    this.loadNotifications();
  }
  loginState = () =>
  {
    this.authService.loginChangeListener()
      .subscribe(state => {
        this.isLoggedIn = state;
    });
    this.isLoggedIn = this.authService.hasLoggedIn();
    this.currentUser = this.authService.getUserInfo();
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
  progressStatus = () => 
  {
    this.progressService.getSubject().subscribe(state => {
      this.showProgress = state;
    });  
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
