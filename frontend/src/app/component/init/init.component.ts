import { Component, OnInit } from '@angular/core';
import { Toast } from 'src/app/model/toast.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ClickEventService } from 'src/app/service/click-event/click-event.service';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { ProgressService } from 'src/app/service/progress/progress.service';
import { ToastService } from 'src/app/service/toast/toast.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit{
  isLoggedIn: boolean = false;
  showProgress: boolean = false;
  public toastList: Toast[] = [];
  
  constructor
  (
    private authService: AuthService,
    private journeyManager: JourneyManagerService,
    private toastService: ToastService,
    private progressService: ProgressService,
    private clickEventService: ClickEventService
  ) { }

  ngAfterViewInit()
  {
    document.addEventListener('click', (event) =>
    {
      this.clickEventService.getClickEvent().next(event);
    });
  }

  ngOnInit(): void
  {
    this.authStatus();
    this.toastStatus();
    this.progressStatus();
    
  }
  progressStatus = () => 
  {
    this.progressService.getSubject().subscribe(state => {
      console.log(state);
      this.showProgress = state;
    });  
  }
  toastStatus = () =>
  {
    this.toastService.getToastSubject()
    .subscribe(toast => {
      this.toastList.push(toast);
    });
  }
  authStatus = () =>
  {
    this.isLoggedIn = this.authService.hasLoggedIn();
    this.authService.loginChangeListener()
      .subscribe(isLogin =>
      {
        this.isLoggedIn = isLogin;
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
}
