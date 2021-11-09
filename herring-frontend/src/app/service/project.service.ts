import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {CustomHttpResponse} from "../model/custom-http-response";

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

  public addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.host + "/herring/project/save", formData);
  }

  public createProjectFormDate(project: Project, loggedUsername: string): FormData {
    const formData = new FormData();
    formData.append('title', project.title);
    formData.append('creator', loggedUsername);
    return formData;
  }

  public deleteProject(title: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(this.host + "/herring/project/delete/" + title);
  }
}
