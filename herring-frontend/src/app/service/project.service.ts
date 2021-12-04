import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {CustomHttpResponse} from "../model/custom-http-response";
import {User} from "../model/user";
import {TaskGroup} from "../model/task-group";

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

  public addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/save", formData);
  }

  public addTaskGroup(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host+"/herring/project/saveTaskGroup", formData);
  }

  public createProjectFormDate(project: Project, loggedUsername: string): FormData {
    const formData = new FormData();
    formData.append('title', project.title);
    formData.append('creator', loggedUsername);
    return formData;
  }

  public createProjectDetailsFormDate(currentTitle: string, project: Project, creator: string): FormData {
    const formData = new FormData();
    formData.append('currentTitle', currentTitle)
    formData.append('title', project.title);
    formData.append('trackFlag', JSON.stringify(project.trackFlag));
    formData.append('description', project.description);
    formData.append('creator', creator);
    return formData;
  }

  public updateProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/update", formData);
  }

  public deleteProject(title: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(this.host + "/herring/project/delete/" + title);
  }

  public addUserToProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/addUserToProject", formData);
  }

  public deleteUserFromProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/deleteUserFromProject", formData);
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
}
