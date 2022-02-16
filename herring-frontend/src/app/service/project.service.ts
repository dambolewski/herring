import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {CustomHttpResponse} from "../model/custom-http-response";
import {TaskGroup} from "../model/task-group";
import {Task} from "../model/task";
import {Form} from "@angular/forms";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.host + "/herring/project/list");
  }

  public getProject(title: string): Observable<Project> {
    return this.http.get<Project>(this.host + "/herring/project/find/" + title)
  }

  public getUserProjects(username: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.host + "/herring/project/" + username);
  }

  public addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/save", formData);
  }

  public addTaskGroup(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/saveTaskGroup", formData);
  }

  public addTask(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/saveTask", formData);
  }

  public createProjectFormDate(project: Project, loggedUsername: string): FormData {
    const formData = new FormData();
    formData.append('title', project.title);
    formData.append('creator', loggedUsername);
    return formData;
  }

  public createProjectDetailsFormDate(currentTitle: string, project: Project, creator: string): FormData {
    const formData = new FormData();
    formData.append('currentTitle', currentTitle);
    formData.append('title', project.title);
    formData.append('trackFlag', JSON.stringify(project.trackFlag));
    formData.append('description', project.description);
    formData.append('creator', creator);
    return formData;
  }

  public createProjectTrackFlagFormData(project: Project, creator: string): FormData {
    const formData = new FormData();
    formData.append('currentTitle', project.title);
    formData.append('title', project.title);
    formData.append('trackFlag', JSON.stringify(!project.trackFlag));
    formData.append('description', project.description);
    formData.append('creator', creator);
    return formData;
  }

  public createTaskFormDate(taskID: string, isDone: boolean): FormData{
    const formData = new FormData();
    formData.append('taskID', taskID);
    formData.append('isDone', JSON.stringify(isDone));
    return formData;
  }

  public updateProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/update", formData);
  }

  public updateTask(formData: FormData): Observable<Task> {
    return this.http.post<Task>(this.host + "/herring/project/updateTask", formData);
  }

  public deleteProject(title: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(this.host + "/herring/project/delete/" + title);
  }

  public deleteTaskGroup(title: string, id: string): Observable<TaskGroup> {
    return this.http.delete<TaskGroup>(this.host + "/herring/project/deleteTaskGroup/" + title + "/" + id);
  }

  public deleteTask(tgID: string, taskID: string): Observable<Task> {
    return this.http.delete<Task>(this.host + "/herring/project/deleteTask/" + tgID + "/" + taskID);
  }

  public addUserToProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/addUserToProject", formData);
  }

  public deleteUserFromProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/deleteUserFromProject", formData);
  }

  public uploadAttachment(title: string, formData: FormData): Observable<HttpEvent<Project>>{
    return this.http.post<HttpEvent<Project>>(this.host + "/herring/project/uploadAttachment/" + title,  formData);
  }

  public deleteAttachment(title:string, attachmentID: string): Observable<Project> {
    return this.http.delete<Project>(this.host + "/herring/project/deleteAttachment/" + title + "/" + attachmentID);
  }

  public addU2PFormData(project: Project, username: string): FormData {
    const formData = new FormData();
    formData.append('title', project.title);
    formData.append('username', username);
    return formData;
  }

  public addTaskGroupFromData(title: string, taskGroup: TaskGroup): FormData {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('tgTitle', taskGroup.title);
    return formData;
  }

  public addTaskFormData(taskGroupID: string, task: Task): FormData {
    const formData = new FormData();
    formData.append('taskGroupID', taskGroupID);
    formData.append('tTitle', task.title);
    return formData;
  }
}
