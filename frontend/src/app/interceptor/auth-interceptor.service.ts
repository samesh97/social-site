import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
}
from "@angular/common/http";
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from "../service/auth/auth.service";
import { Observable, ReplaySubject, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Response } from "../model/response.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private hasTokenRefreshed: boolean = true;
  private refreshTokenSubject = new ReplaySubject<boolean>(1);

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, handler: HttpHandler)
  {
    const clonedReq = this.cloneRequest(req);
    return handler.handle(clonedReq).pipe(
      catchError((err) => {
        return this.handleError(clonedReq, handler, err)
      })
    );
  }
  private handleError = (
    request: HttpRequest<any>,
    handler: HttpHandler,
    err: HttpErrorResponse
  ): Observable<any> =>
  {
    if (this.isUnauthorized(err) && this.isNotTokenRefreshRq(err) && this.hasTokenRefreshed)
    {
      //refreshing the access token
      this.hasTokenRefreshed = false;
      return this.authService.refresh().pipe(
        switchMap((data: Response) => {
          this.hasTokenRefreshed = true;
          if (data.code == 200)
          {
            this.authService.updateSessionId(data.data.sessionId);
            this.refreshTokenSubject.next(true);
            const req = this.cloneRequest(request);
            return handler.handle(req);
          }
          return throwError(() => new Error(data.data));
        }),
        catchError((err) => {
          if (this.isUnauthorized(err))
          {
            this.authService.setLoggedIn(false); 
          }
          return throwError(() => new Error(err));
        })
      );
    }
    else if (!this.hasTokenRefreshed)
    {
      return this.refreshTokenSubject.pipe(
        switchMap(() => {
          const req = this.cloneRequest(request);
          return handler.handle(req);
        })
      )
    }
    return throwError(() => new Error(err.message));
  };
  private isNotTokenRefreshRq = (err: HttpErrorResponse) =>
  {
    return !err.url?.endsWith("/auth/refresh");
  }
  private isUnauthorized = (err: HttpErrorResponse) =>
  {
    return err.status == 401;
  }
  private cloneRequest = (req: HttpRequest<any>) =>
  {
    const userInfo = this.authService.getUserInfo();
    const sessionId = userInfo.sessionId ? userInfo.sessionId: "";
    const headers = new HttpHeaders({
      's-id' : sessionId
    })
    return req.clone(
      {
        withCredentials: true,
        headers: headers
      }
    );
  }
}