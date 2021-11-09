import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {Role} from "../../../enum/role.enum";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../model/user";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {NotificationService} from "../../../service/notification.service";
import {SubSink} from "subsink";
import {NgForm} from "@angular/forms";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../../../model/custom-http-response";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Projects');
  public titleActions$ = this.titleSubject.asObservable();
  public user!: User;
  public projects!: Project[] | null;
  public refreshing!: boolean;

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getProjects(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public saveNewProject() {
    this.clickButton('new-project-save');
  }

  public onAddNewProject(newProjectForm: NgForm): void {
    const formData = this.projectService.createProjectFormDate(newProjectForm.value, this.user.username);
    const formData2 = this.projectService.addU2PFormData(newProjectForm.value, this.user.username);
    this.subs.add(
      this.projectService.addProject(formData).subscribe(
        (response: Project) => {
          this.clickButton('new-project-close');
          this.getProjects(false);
          newProjectForm.reset();
          this.projectService.addUserToProject(formData2).subscribe();
          this.sendNotification(NotificationTypeEnum.SUCCESS, response.title + " created successfully.");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      ),
    );
  }


  public getProjects(showNotification: boolean) {
    this.refreshing = true;
    this.subs.add(
      this.projectService.getProjects().subscribe(
        (response: Project[]) => {
          this.projects = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationTypeEnum.SUCCESS, response.length + " project(s) loaded successfully.");
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  public onDelete(title: string): void {
    this.subs.add(
      this.projectService.deleteProject(title).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, 'Project deleted successfully');
          this.getProjects(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      )
    )
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

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)!.click();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
