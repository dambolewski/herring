import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {NotificationService} from "../../service/notification.service";
import {User} from "../../model/user";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {NotificationTypeEnum} from "../../enum/notification-type.enum";
import {HeaderTypeEnum} from "../../enum/header-type.enum";
import {SubSink} from "subsink";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading: boolean | undefined;
  private subs = new SubSink();


  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl("/users");
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  public onLogin(user: User): void {
    this.showLoading = true;
    this.subs.add(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderTypeEnum.JWT_TOKEN);
          this.authenticationService.saveToken(<string>token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/home');
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendErrorNotification(notificationTypeEnum: NotificationTypeEnum, message: string): void {
    if (message) {
      this.notificationService.notify(notificationTypeEnum, message);
    } else {
      this.notificationService.notify(notificationTypeEnum, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
