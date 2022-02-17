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
import {HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Attachment} from "../../../model/attachment";

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
  public fileName!: string | null;
  public profileImage!: File | null;
  public attachments!: Attachment[];
  public attachmentID!: string;

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService, private projectService: ProjectService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.project = history.state;
    this.getU2P(true);
    this.oldTitle = this.project.title;
    this.usersAll = this.userService.getUsersFromLocalCache();
    this.attachments = this.project.attachments;
  }

  public onProjectDetailsUpdate(projectUpdate: Project): void {
    this.refreshing = true;
    const formData = this.projectService.createProjectDetailsFormDate(this.oldTitle, projectUpdate, this.project.creator);
    const formData2 = new FormData();
    formData2.append('title', projectUpdate.title);
    formData2.append('username',this.user.username);
    this.subs.add(
      this.projectService.updateProject(formData).subscribe(
        (response: Project) => {
          this.refreshing = false;
          this.sendNotification(NotificationTypeEnum.SUCCESS, projectUpdate.title + " project updated successfully.");
          this.projectService.uploadActivity(formData2).subscribe(

          );
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

  public deleteUserFromProject(selectedUser: User, ngForm: NgForm): void {
    this.userTest = selectedUser;
    const formData = this.projectService.addU2PFormData(this.project, selectedUser.username);
    this.projectService.deleteUserFromProject(formData).subscribe(
      (response: Project) => {
        this.getU2P(false);
        ngForm.reset();
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

  public onDeleteAttachment(title: string, id: number): void {
    this.attachmentID = id.toString();
    this.subs.add(
      this.projectService.deleteAttachment(title, this.attachmentID).subscribe(
        (response: Project) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, 'Attachment deleted successfully');
          this.getAttachments(false);
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
          if (response === null || response === undefined) {
            this.router.navigateByUrl("/project-list")
          } else {
            this.users = Object.values(response)[9];
          }
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  public getAttachments(showNotification: boolean) {
    this.subs.add(
      this.projectService.getProject(this.project.title).subscribe(
        (response: Project) => {
          if (response === null || response === undefined) {
            this.router.navigateByUrl("/project-list")
          } else {
            this.attachments = Object.values(response)[11];
          }
        }
      )
    )
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }


  public get isManager(): boolean {
    return this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
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

  public getUsersToSelect(usersAll: User[]): User[] {
    let allUsersToAdd = usersAll;
    let addedUsersToProject = this.users;
    return allUsersToAdd.filter(o1 => !addedUsersToProject?.some(o2 => o1?.userId === o2?.userId));
  }

  updateProfileImage(appProject: Project) {
    this.clickButton('profile-image-input');
    console.log(appProject.title);
  }

  onProfileImageChange(event: any) {
    this.fileName = (<HTMLInputElement>event.target).files![0].name;
    this.profileImage = (<HTMLInputElement>event.target).files![0];
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)!.click();
  }

  onUpdateProfileImage(appProject: Project) {
    const formData = new FormData();
    formData.append('file', this.profileImage!);
    this.subs.add(
      this.projectService.uploadAttachment(appProject.title, formData).subscribe(
        (response: HttpEvent<any>) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, this.profileImage?.name + " added successfully.");
          this.getAttachments(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onClickRedirect(attachment: Attachment) {
    window.open(attachment.url);
  }
}
