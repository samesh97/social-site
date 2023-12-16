import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
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

  private loginStateSubject = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) {}

  login = (email: string, password: string): Observable<Response> => {
    return this.http.post<Response>(
      this.LOGIN_URL,
      { email, password }
    );
  };
  verify = (): Observable<Response> => {
    return this.http.post<Response>(
      this.VERIFY_URL, {}
    );
  };
  refresh = (): Observable<Response> => {
    return this.http.post<Response>(
      this.REFRESH_URL,{}
    );
  };
  logout = (): Observable<Response> => {
    return this.http.post<Response>(
      this.LOGOUT_URL,{}
    );
  }

  setLoggedIn = (value: boolean) => {
    sessionStorage.setItem('loginState', value.toString());
    if (!value)
    {
      this.setUserInfo(new Response());  
    }
    this.loginStateSubject.next(value);
  };
  hasLoggedIn = (): boolean => {
    let loginStatus = sessionStorage.getItem('loginState');
    return loginStatus ? loginStatus == 'true' : false;
  };
  loginChangeListener = (): Observable<boolean> => 
  {
    return this.loginStateSubject;
  }
  setUserInfo = (res: Response) =>
  {
    if (res == null || res.data == null )
    {
      sessionStorage.removeItem('userInfo');
      return;
    }
    const data = JSON.stringify(res.data);
    sessionStorage.setItem('userInfo', data);
  }
  getUserInfo = () =>
  {
    const data = sessionStorage.getItem('userInfo');
    return JSON.parse(data ? data : "{}");
  }
}
