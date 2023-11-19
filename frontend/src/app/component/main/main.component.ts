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
export class MainComponent implements OnInit{
  public searchText: string = "";
  searchUsers: User[] = [];
  isLoggedIn: boolean = false;
  showProgress: boolean = false;
  
  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private journeyManager: JourneyManagerService,
    private progressService: ProgressService
  ) { }
  
  ngOnInit(): void
  {
    this.loginState();
    this.progressStatus();
  }
  loginState = () =>
  {
    this.isLoggedIn = this.authService.hasLoggedIn();
    this.authService.loginChangeListener().subscribe(isLogin => {
      this.isLoggedIn = isLogin;
      console.log('Login state checked ' + isLogin);
      if(isLogin)
      {
        this.journeyManager.loadHome();
      }
      else
      {
        this.journeyManager.loadLogin();
      }
    });  
  }
  search()
  {
    this.userService.search(this.searchText).subscribe(data => {
      this.searchUsers = data.data;
      console.log(data);
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
