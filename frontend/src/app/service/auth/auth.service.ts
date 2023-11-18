import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { config } from '../../configuration/common.conf';
import { Response } from 'src/app/model/response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOGIN_URL = `${config.SERVER_BASE_URL}/auth/login`;
  private VERIFY_URL = `${config.SERVER_BASE_URL}/auth/verify`;
  private REFRESH_URL = `${config.SERVER_BASE_URL}/auth/refresh`;
  private LOGOUT_URL = `${config.SERVER_BASE_URL}/auth/logout`;

  constructor(private http: HttpClient, private router: Router) {}

  login = (email: string, password: string): Observable<Response> => {
    return this.http.post<Response>(
      this.LOGIN_URL,
      { email, password },
      { withCredentials: true }
    );
  };
  verify = (): Observable<Response> => {
    return this.http.post<Response>(
      this.VERIFY_URL,
      {},
      { withCredentials: true }
    );
  };
  refresh = (): Observable<Response> => {
    return this.http.post<Response>(
      this.REFRESH_URL,
      {},
      { withCredentials: true }
    );
  };
  logout = (): Observable<Response> => {
    return this.http.post<Response>(
      this.LOGOUT_URL,
      {},
      { withCredentials: true }
    );
  }

  setLoggedIn = (value: boolean, url: string) => {
    localStorage.setItem('loginState', value.toString());
    this.router.navigate([url]);
  };
  hasLoggedIn = (): boolean => {
    const loginStatus = localStorage.getItem('loginState');
    return loginStatus ? loginStatus == 'true' : false;
  };
}
