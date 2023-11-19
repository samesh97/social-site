import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { JourneyManagerService } from '../service/journey-manager/journey-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private journeyManager: JourneyManagerService, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const status = this.authService.hasLoggedIn();
    console.log(`AuthGuard -> ${status}`);
    if (!status)
    {
      this.journeyManager.loadLogin();
    }
    return status;
  }
  
}
