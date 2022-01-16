import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UsersService} from "./users.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url != '/users/login' && this.usersService.isUserLoggedIn()) {
      const tokenType = this.usersService.getAuthTokenType();
      const token = this.usersService.getAuthToken();

      request = request.clone({
        setHeaders: {Authorization: `${tokenType} ${token}`}
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (request.url != '/users/login' && (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden)) {
            this.usersService.removeAuth()
            this.router.navigate(['login'], {
              queryParams: {
                reason: 'Insufficient credentials access level'
              }
            });
          }
        }
        return throwError(err);
      })
    )
  }
}
