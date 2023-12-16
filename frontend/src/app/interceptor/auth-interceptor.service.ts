import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
}
from "@angular/common/http";
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from "../service/auth/auth.service";
import { Observable, ReplaySubject, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Response } from "../model/response.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshRequestSent: boolean = false;
  private refreshTokenSubject = new ReplaySubject<boolean>(1);
  constructor(
    private authService: AuthService)
  { }

  intercept(req: HttpRequest<any>, handler: HttpHandler) {
    let cloneReq = req.clone({
      withCredentials: true
    });
    return handler.handle(cloneReq).pipe(
      catchError((err) => {
        return this.handleError(cloneReq, handler, err)
      })
    );
  }
  private handleError = (
    request: HttpRequest<any>,
    handler: HttpHandler,
    err: any
  ): Observable<any> =>
  {
    if (err.status == 401 && !err.url?.endsWith("/auth/refresh") && !this.isRefreshRequestSent)
    {
      this.isRefreshRequestSent = true;
      return this.authService.refresh().pipe(
        switchMap((data: Response) => {
          this.isRefreshRequestSent = false;
          if (data.code == 200)
          {
            this.refreshTokenSubject.next(true);
            return handler.handle(request);
          }
          return throwError(data);
        }),
        catchError((err) => {
          this.authService.setLoggedIn(false);
          return throwError(err);
        })
      );
    }
    else if (this.isRefreshRequestSent)
    {
      return this.refreshTokenSubject.pipe(
        switchMap(() => {
          return handler.handle(request);
        })
      )
    }
    return throwError(err);
  };
}