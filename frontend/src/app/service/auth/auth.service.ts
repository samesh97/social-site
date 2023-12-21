import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { config } from '../../configuration/common.conf';
import { Response } from 'src/app/model/response.model';
import { User } from 'src/app/model/user.model';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '../../util/common.util';

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

  loginChangeListener = (): Observable<boolean> => 
  {
    return this.loginStateSubject;
  }

  setLoggedIn = (value: boolean) => {
    setSessionStorage(config.LOGIN_STATE_KEY, value.toString());
    if (!value)
    {
      this.clearStorage();  
    }
    this.loginStateSubject.next(value);
  };
  hasLoggedIn = (): boolean =>
  {
    let loginStatus = getSessionStorage(config.LOGIN_STATE_KEY);
    return loginStatus ? loginStatus == 'true' : false;
  };
  setUserInfo = (user: User) =>
  {
    if (!user)
    {
      return;
    }
    const data = JSON.stringify(user);
    setSessionStorage(config.USER_PROFILE_INFO_KEY, data);
  }
  getUserInfo = () =>
  {
    const data = getSessionStorage(config.USER_PROFILE_INFO_KEY);
    return JSON.parse(data ? data : "{}");
  }
  private clearStorage = () =>
  {
    removeSessionStorage(config.USER_PROFILE_INFO_KEY);
    removeSessionStorage(config.LOGIN_STATE_KEY);
  }
  updateSessionId = (sessionId: string) => 
  {
    const userInfo = this.getUserInfo();
    if (userInfo)
    {
      userInfo.sessionId = sessionId;
      this.setUserInfo(userInfo);
    }
  }
}
