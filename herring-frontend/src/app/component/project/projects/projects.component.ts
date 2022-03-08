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
import {Router} from "@angular/router";
import {TaskGroup} from "../../../model/task-group";
import {publish} from "rxjs/operators";

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
  public projectTest!: Project;
  public result!: Project[] | undefined;
  public resultProjects!: Project[] | null;

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private projectService: ProjectService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getProject(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public saveNewProject() {
    this.clickButton('new-project-save');
  }

  public getProject(showNotification: boolean) {
    if (this.isAdmin)
      this.getProjectsAll(true);
    else
      this.getProjectUsers(true);
  }

  public onAddNewProject(newProjectForm: NgForm): void {
    const formData = this.projectService.createProjectFormDate(newProjectForm.value, this.user.username);
    const formData2 = this.projectService.addU2PFormData(newProjectForm.value, this.user.username);
    this.subs.add(
      this.projectService.addProject(formData).subscribe(
        (response: Project) => {
          this.clickButton('new-project-close');
          newProjectForm.reset();
          this.projectService.addUserToProject(formData2).subscribe(
            (response: Project) => {
              this.getProject(false);
            }
          );
          this.sendNotification(NotificationTypeEnum.SUCCESS, response.title + " created successfully.");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      ),
    );
  }

  public onSelectProject(selectedProject: Project): void {
    this.projectTest = selectedProject;
    this.router.navigateByUrl('/project-details', {state: this.projectTest});
  }


  public getProjectsAll(showNotification: boolean) {
    this.refreshing = true;
    this.subs.add(
      this.projectService.getProjects().subscribe(
        (response: Project[]) => {
          this.projects = response;
          this.resultProjects = response;
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

  public getProjectUsers(showNotification: boolean) {
    const username: string = this.user.username;
    this.refreshing = true;
    this.subs.add(
      this.projectService.getUserProjects(username).subscribe(
        (response: Project[]) => {
          this.projects = response;
          this.resultProjects = response;
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

  public onDelete(uuid: string): void {
    this.subs.add(
      this.projectService.deleteProject(uuid).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationTypeEnum.SUCCESS, 'Project deleted successfully');
          this.getProject(false);
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

  onSelectToOperations(appProject: Project) {
    this.projectTest = appProject;
    if (!appProject.status)
      this.router.navigateByUrl('/project-operations', {state: this.projectTest});
  }

  changeTrackFlag(appProject: Project) {
    const formData2 = new FormData();
    formData2.append('title', appProject.title);
    formData2.append('username',this.user.username);
    const formData = this.projectService.createProjectTrackFlagFormData(appProject, appProject.creator);
    this.subs.add(
      this.projectService.updateProject(formData).subscribe(
        (response: Project) => {
          this.getProject(false);
          this.projectService.uploadActivity(formData2).subscribe(

          );
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public searchProjects(searchTerm: string): void {
    const result: Project[] = [];
    for (const project of this.resultProjects!) {
      if (project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        project.uuid.indexOf(searchTerm) !== -1 ||
        project.creator.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        result.push(project);
      }
    }
    this.projects = result;
  }

  public onProjectCompleteCheck(project: Project): boolean {
    let checker = false;
    let taskGroupsCheck: TaskGroup[] = project.taskGroups;
    if(taskGroupsCheck.every(x => x.done)){
      checker = true;
    }
    return checker;
  }

  public onProjectComplete(project: Project, checker: boolean) {
    if (checker) {
      const formData = this.projectService.createProjectCompleteFormData(project);
      const formData2 = new FormData();
      formData2.append('title', project.title);
      formData2.append('username',this.user.username);

      this.subs.add(
        this.projectService.updateProject(formData).subscribe(
          (response: Project) => {
            this.sendNotification(NotificationTypeEnum.SUCCESS, project.title + " project completed successfully. Congratulations.");
            this.getProject(false);
            this.projectService.uploadActivity(formData2).subscribe(

            );
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          }
        )
      );
    }
  }

  public onProjectWorking(project:Project) {
    const formData = this.projectService.createProjectCompleteFormData(project);
    this.subs.add(
      this.projectService.updateProject(formData).subscribe(
        (response: Project) => {
          this.getProject(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  onProject(appProject: Project) {
    console.log(this.onProjectCompleteCheck(appProject));
  }
}
