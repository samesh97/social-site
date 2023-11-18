import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  public constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void
  {
    this.loginState();
  }
  loginState = () =>
  {
    this.authService.loginChangeListener().subscribe(isLogin => {
      if (isLogin)
      {
        this.router.navigate(['/']);
      }
      else
      {
        this.router.navigate(['/login']);  
      }
    });  
  }
}
