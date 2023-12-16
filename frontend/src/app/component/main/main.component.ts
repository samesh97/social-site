import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { ProgressService } from 'src/app/service/progress/progress.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-main',
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
  
  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private journeyManager: JourneyManagerService,
    private progressService: ProgressService
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
  }
  
  ngOnInit(): void
  {
    this.loginState();
    this.progressStatus();
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
}
