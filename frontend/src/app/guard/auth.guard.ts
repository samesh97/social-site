import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { JourneyManagerService } from '../service/journey-manager/journey-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private journeyManager: JourneyManagerService,
    private authService: AuthService,
    private router: Router
  ){ }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {

    const result = this.authService.hasLoggedIn();
    if (!result)
    {
      this.journeyManager.loadLogin();
    }
    return result;
  }
  
}
