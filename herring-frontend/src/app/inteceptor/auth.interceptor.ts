import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../service/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(httpRequest: HttpRequest<unknown>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(this.authenticationService.host + "/login")) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(this.authenticationService.host + "/register")) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(this.authenticationService.host + "/resetPassword")) {
      return httpHandler.handle(httpRequest);
    }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    console.log(token);
    const request = httpRequest.clone({
      setHeaders: {Authorization: 'Bearer ' + token}
    });
    return httpHandler.handle(request);
  }
}
