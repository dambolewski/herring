import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {NotificationService} from "../../service/notification.service";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {NotificationTypeEnum} from "../../enum/notification-type.enum";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {Role} from "../../enum/role.enum";
import {SubSink} from "subsink";
import {BehaviorSubject} from "rxjs";
import {FileUploadStatus} from "../../model/file-upload.status";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('User Details');
  public titleActions$ = this.titleSubject.asObservable();
  public user!: User;
  public refreshing!: boolean;
  public fileName!: string | null;
  public profileImage!: File | null;
  private currentUsername!: string;
  public fileStatus = new FileUploadStatus();

  constructor(private userService: UserService, private notificationService: NotificationService, private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }


  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public onProfileImageChange(event: Event): void {
    this.fileName = (<HTMLInputElement>event.target).files![0].name;
    this.profileImage = (<HTMLInputElement>event.target).files![0];
  }


  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    const formData = this.userService.createUserFormDate(this.currentUsername, this.user, this.profileImage!);
    this.subs.add(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.fileName = null;
          this.profileImage = null;
          this.refreshing = false;
          this.sendNotification(NotificationTypeEnum.SUCCESS, response.firstName + " " + response.lastName + " updated successfully.")
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);``
          this.refreshing = false;
          this.profileImage = null;

        }
      )
    );
  }

  public onLogOut(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationTypeEnum.SUCCESS, `You've been successfully logged out`);
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage!);
    this.subs.add(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.status = 'progress';
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total!);
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = event.body.profileImageUrl + "?time=$" + new Date().getTime();
          this.sendNotification(NotificationTypeEnum.SUCCESS, event.body.firstName + `'s profile image updated successfully`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.sendNotification(NotificationTypeEnum.SUCCESS, `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }


  public get isManagerOrHr(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.MANAGER || this.getUserRole() === Role.HR;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManagerOrHr;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)!.click();
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
