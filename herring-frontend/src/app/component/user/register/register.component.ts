import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../service/authentication.service";
import {NotificationService} from "../../../service/notification.service";
import {User} from "../../../model/user";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {SubSink} from "subsink";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading: boolean | undefined;
  private subs = new SubSink();

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl("/user/users");
    }
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    this.subs.add(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.sendNotification(NotificationTypeEnum.SUCCESS, 'A new account was created for ' + response.firstName +
            '. Please check your email for password to log in.');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendNotification(notificationTypeEnum: NotificationTypeEnum, message: string): void {
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
