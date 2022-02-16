import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthenticationService} from "../../service/authentication.service";
import {Role} from "../../enum/role.enum";
import {User} from "../../model/user";
import {NotificationTypeEnum} from "../../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {SubSink} from "subsink";
import {NotificationService} from "../../service/notification.service";
import {ProjectService} from "../../service/project.service";
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {Project} from "../../model/project";
import {Activity} from "../../model/activity";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private titleSubject = new BehaviorSubject<string>('Home');
  public titleActions$ = this.titleSubject.asObservable();
  public user!: User;
  private subs = new SubSink();
  public users!: User[] | null;
  public projects!: Project[] | null;
  public activities!: Activity[];

  constructor(private userService: UserService, private notificationService: NotificationService, private authenticationService: AuthenticationService, private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(false);
    this.getProjects(false);
  }

  public getUsers(showNotification: boolean): void {
    this.subs.add(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
        }
      )
    );
  }

  public getProjects(showNotification: boolean) {
    this.subs.add(
      this.projectService.getProjects().subscribe(
        (response: Project[]) => {
          this.projects = response;
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


  public get isManager(): boolean {
    return this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }
}
