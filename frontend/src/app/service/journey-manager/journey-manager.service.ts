import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JourneyManagerService
{
  constructor(private router: Router) { }

  loadProfileView = (profileId: string) =>
  {
    this.router.navigate(['/profile'], { queryParams: { id: profileId } });
  }
  loadHome = () =>
  {
    this.router.navigate(['/']);  
  }
  loadLogin = () =>
  {
    this.router.navigate(['/login']);  
  }
  loadRegister = () =>
  {
    this.router.navigate(['register']);  
  }
}
