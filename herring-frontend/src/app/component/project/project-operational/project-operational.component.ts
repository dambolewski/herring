import { Component, OnInit } from '@angular/core';
import {SubSink} from "subsink";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../model/user";
import {AuthenticationService} from "../../../service/authentication.service";
import {NotificationService} from "../../../service/notification.service";
import {ProjectService} from "../../../service/project.service";
import {UserService} from "../../../service/user.service";
import {Role} from "../../../enum/role.enum";
import {Project} from "../../../model/project";
import {TaskGroup} from "../../../model/task-group";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";

@Component({
  selector: 'app-project-operational',
  templateUrl: './project-operational.component.html',
  styleUrls: ['./project-operational.component.css']
})
export class ProjectOperationalComponent implements OnInit {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Projects');
  public titleActions$ = this.titleSubject.asObservable();
  public refreshing!: boolean;
  public user!: User;
  public project!: Project;
  public tasksGroups!: TaskGroup[];

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private projectService: ProjectService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.project = history.state;
    this.tasksGroups = this.project.taskGroups;
    this.getTaskGroups(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onAddNewTaskGroup(newTaskGroupFrom: NgForm) {
    const formData = this.projectService.addTaskGroupFromData(this.project.title, newTaskGroupFrom.value);
    this.subs.add(
      this.projectService.addTaskGroup(formData).subscribe(
        (response: Project) => {
          this.clickButton('new-project-close');
          newTaskGroupFrom.reset();
          this.getTaskGroups(false);
        }
      )
    )
    this.getTaskGroups(true);
  }

  public saveNewProject() {
    this.clickButton('new-task-group-save');
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)!.click();
  }

  public getTaskGroups(showNotification: boolean) {
    this.refreshing = true;
    this.subs.add(
      this.projectService.getProject(this.project.title).subscribe(
        (response: Project) => {
          this.tasksGroups = Object.values(response)[8];
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  private sendNotification(notificationType: NotificationTypeEnum, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }
}
