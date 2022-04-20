import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {NotificationService} from "../../../service/notification.service";
import {AuthenticationService} from "../../../service/authentication.service";
import {User} from "../../../model/user";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../../model/custom-http-response";
import {Role} from "../../../enum/role.enum";
import {SubSink} from "subsink";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.css']
})
export class SettingsUserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('User Settings');
  public titleActions$ = this.titleSubject.asObservable();
  public user!: User;
  public refreshing!: boolean;

  constructor(private userService: UserService, private notificationService: NotificationService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public onResetPassword(emailForm: NgForm): void {
    const emailAddress = emailForm.value['reset-password-email'];
    this.refreshing = true;
    this.subs.add(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, response.message);
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.WARNING, errorResponse.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  private sendNotification(notificationType: NotificationTypeEnum, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
