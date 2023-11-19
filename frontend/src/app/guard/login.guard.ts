import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { JourneyManagerService } from '../service/journey-manager/journey-manager.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(private journeyManager: JourneyManagerService, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean
  {
    const status = this.authService.hasLoggedIn();
    console.log(`LoginGuard -> ${status}`);
    if (status)
    {
      this.journeyManager.loadHome();
    }
    return !status;
  }
}
