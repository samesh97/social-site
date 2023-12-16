import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { Response } from 'src/app/model/response.model';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor( private authService: AuthService, private journeyManager: JourneyManagerService ) {  }

  login = () => {
    this.authService.login(this.email, this.password)
      .subscribe((data: Response) => {
        if (data.code == 200)
        {
          this.authService.setUserInfo(data);
          this.authService.setLoggedIn(true);
        }
    });
  };
  clickedRegister()
  {
    this.journeyManager.loadRegister();
  }
}
