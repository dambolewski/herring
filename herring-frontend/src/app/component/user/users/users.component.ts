import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {NotificationService} from "../../../service/notification.service";
import {AuthenticationService} from "../../../service/authentication.service";
import {Router} from "@angular/router";
import {SubSink} from "subsink";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../model/user";
import {FileUploadStatus} from "../../../model/file-upload.status";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../../model/custom-http-response";
import {Role} from "../../../enum/role.enum";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleActions$ = this.titleSubject.asObservable();
  public users!: User[] | null;
  public user!: User;
  public refreshing!: boolean;
  public selectedUser!: User;
  public fileName!: string | null;
  public profileImage!: File | null;
  public editUser = new User();
  private currentUsername!: string;
  public fileStatus = new FileUploadStatus();

  constructor(private userService: UserService, private notificationService: NotificationService, private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subs.add(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationTypeEnum.SUCCESS, response.length + " user(s) loaded successfully.");
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }


  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    document.getElementById('openUserInfo')!.click();
  }

  public onProfileImageChange(event: Event): void {
    this.fileName = (<HTMLInputElement>event.target).files![0].name;
    this.profileImage = (<HTMLInputElement>event.target).files![0];
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormDate('', userForm.value, this.profileImage!);
    this.subs.add(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          userForm.reset();
          this.sendNotification(NotificationTypeEnum.SUCCESS, response.firstName + " " + response.lastName + " added successfully.")
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    );
  }

  public searchUsers(searchTerm: string): void {
    const result: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()!) {
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.indexOf(searchTerm) !== -1) {
        result.push(user);
      }
    }
    this.users = result;
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }


  public onDelete(username: string): void {
    this.subs.add(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, 'User deleted successfully');
          this.getUsers(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      )
    )
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.profileImage!);
    this.subs.add(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationTypeEnum.SUCCESS, response.firstName + " " + response.lastName + " updated successfully.")
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    );
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
