import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from "../service/auth/auth.service";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Response } from "../model/response.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, handler: HttpHandler) {
    let cloneReq = req;
    return handler
      .handle(cloneReq)
      .pipe(catchError((err) => this.handleError(cloneReq, handler, err)));
  }
  private handleError = (
    request: HttpRequest<any>,
    handler: HttpHandler,
    err: any
  ): Observable<HttpEvent<any>> => {
    if (err instanceof HttpErrorResponse && err.status == 401) {
      return this.authService.refresh().pipe(
        switchMap((data: Response) => {
          if (data.code == 200) {
            return handler.handle(request);
          }
          return throwError(data);
        }),
        catchError((err) => {
          this.authService.setLoggedIn(false, '/login');
          return throwError(err);
        })
      );
    }
    return throwError(err);
  };
}