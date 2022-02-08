import {Component, OnInit} from '@angular/core';
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
import {Task} from "../../../model/task";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Router} from "@angular/router";


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
  public tasks!: Task[];
  public idTest!: string;
  private taskId!: string;
  private taskGroupID!: string;
  public todoTasks!: Task[];
  public doneTasks!: Task[];
  public resultTaskGroups!: TaskGroup[];

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService, private projectService: ProjectService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.project = history.state;
    this.tasksGroups = this.project.taskGroups;
    this.resultTaskGroups = this.tasksGroups;
    this.getTaskGroups(false);
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

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.onTaskUpdate(event.previousContainer.data[event.previousIndex].id, event.previousContainer.data[event.previousIndex].done);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
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
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    )
    this.getTaskGroups(true);
  }

  public onAddNewTask(taskGroup: number, newTaskForm: NgForm) {
    const formData = this.projectService.addTaskFormData(String(taskGroup), newTaskForm.value);
    this.subs.add(
      this.projectService.addTask(formData).subscribe(
        (response: Project) => {
          this.clickButton('new-task-close');
          this.getTaskGroups(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    )
    this.getTaskGroups(false);
  }

  public saveNewTaskGroup() {
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
          if (response === null || response === undefined) {
            this.router.navigateByUrl("/project-list")
          } else {
            this.tasksGroups = Object?.values(response)[8];
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

  public getTasks(showNotification: boolean) {
    this.refreshing = true;
    this.subs.add(
      this.projectService.getProject(this.project.title).subscribe(
        (response: Project) => {
          this.tasksGroups = Object?.values(response)[8];
          this.tasks = this.tasksGroups[0]?.tasks;
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  public onTaskUpdate(taskID: number, isDone: boolean): void {
    const formData = this.projectService.createTaskFormDate(String(taskID!), !isDone!);
    this.subs.add(
      this.projectService.updateTask(formData).subscribe(
        (response: Task) => {
          this.getTasks(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationTypeEnum.ERROR, errorResponse.error.message);
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

  public onDelete(id: number) {
    this.idTest = id.toString();
    this.subs.add(
      this.projectService.deleteTaskGroup(this.project.title, this.idTest).subscribe(
        (response: TaskGroup) => {
          this.getTaskGroups(false);
        }
      )
    )
  }

  public onDeleteTask(taskGroupID: number, id: number) {
    this.taskGroupID = taskGroupID.toString();
    this.taskId = id.toString();
    this.subs.add(
      this.projectService.deleteTask(this.taskGroupID, this.taskId).subscribe(
        (response: Task) => {
          this.getTasks(false);
        }
      )
    )
  }

  filterTasksToDo(tasks: Task[]) {
    this.todoTasks = tasks?.filter(t => !t.done);
    return this.todoTasks;
  }

  filterTasksDone(tasks: Task[]) {
    this.todoTasks = tasks?.filter(t => t.done);
    return this.todoTasks;
  }

  getPercentages(allTasks: TaskGroup): number {
    let all = allTasks?.tasks?.length;
    let done = this.filterTasksDone(allTasks?.tasks)?.length;
    let result = ((done / all) * 100);
    if (isNaN(result)) {
      result = 0;
      return result;
    } else {
      return Math.round(result);
    }
  }

  searchTaskGroups(searchTerm: string) {
    const result: TaskGroup[] = [];
    for (const taskGroup of this.resultTaskGroups!) {
      if (taskGroup.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        result.push(taskGroup);
      }
    }
    this.tasksGroups = result;
  }
}
