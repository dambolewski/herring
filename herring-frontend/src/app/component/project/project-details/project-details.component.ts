import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/project";
import {SubSink} from "subsink";
import {AuthenticationService} from "../../../service/authentication.service";
import {NotificationService} from "../../../service/notification.service";
import {ProjectService} from "../../../service/project.service";
import {Role} from "../../../enum/role.enum";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../model/user";
import {CustomHttpResponse} from "../../../model/custom-http-response";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Projects');
  public titleActions$ = this.titleSubject.asObservable();
  public user!: User;
  public project!: Project;
  public refreshing!: boolean;
  public currentTitle!: string;
  public oldTitle!: string;
  public users!: User[];
  public usersAll!: User[] | null;
  public userTest!: User;
  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private projectService: ProjectService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.project = history.state;
    this.getU2P(true);
    this.oldTitle = this.project.title;
    this.usersAll = this.userService.getUsersFromLocalCache();
  }

  public onProjectDetailsUpdate(projectUpdate: Project): void {
    this.refreshing = true;
    const formData = this.projectService.createProjectDetailsFormDate(this.oldTitle, projectUpdate, this.project.creator);
    this.subs.add(
      this.projectService.updateProject(formData).subscribe(
        (response: Project) => {
          this.refreshing = false;
          this.sendNotification(NotificationTypeEnum.SUCCESS, projectUpdate.title + " project updated successfully.")
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }


  public onProjectDetailsAddU2P(u2pForm: User): void {
    const formData2 = this.projectService.addU2PFormData(this.project, u2pForm.username);
    this.projectService.addUserToProject(formData2).subscribe(
      (response: Project) => {
        this.getU2P(false);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationTypeEnum.ERROR, u2pForm.username + " is already assigned.")
      }
    );
  }

  public deleteUserFromProject(selectedUser: User): void {
    this.userTest = selectedUser;
    const formData = this.projectService.addU2PFormData(this.project, selectedUser.username);
    this.projectService.deleteUserFromProject(formData).subscribe(
      (response: Project) => {
        this.getU2P(false);
      }
    );
  }


  public onDelete(title: string): void {
    this.subs.add(
      this.projectService.deleteProject(title).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, 'Project deleted successfully');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      )
    )
  }

  public getU2P(showNotification: boolean) {
    this.refreshing = true;
    this.subs.add(
      this.projectService.getProject(this.project.title).subscribe(
        (response: Project) => {
          this.users = Object.values(response)[7];
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
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

  private sendNotification(notificationType: NotificationTypeEnum, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  public getUsersToSelect(usersAll: User[]): User[]{
    let allUsersToAdd = usersAll;
    let addedUsersToProject = this.users;
    let usersToAdd = allUsersToAdd.filter(o1 => !addedUsersToProject?.some(o2 => o1?.userId === o2?.userId));
    return usersToAdd;
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)!.click();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
