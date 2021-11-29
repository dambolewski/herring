import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthenticationService} from "./service/authentication.service";
import {UserService} from "./service/user.service";
import {AuthInterceptor} from "./inteceptor/auth.interceptor";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {NotificationModule} from "./notification.module";
import {NotificationService} from "./service/notification.service";
import {LoginComponent} from './component/user/login/login.component';
import {RegisterComponent} from './component/user/register/register.component';
import {FormsModule} from "@angular/forms";
import { UsersComponent } from './component/user/users/users.component';
import { SettingsUserComponent } from './component/user/settings-user/settings-user.component';
import { UserInfoComponent } from './component/user/user-info/user-info.component';
import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/project/projects/projects.component';
import { ProjectDetailsComponent } from './component/project/project-details/project-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    SettingsUserComponent,
    UserInfoComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NotificationModule,
        FormsModule
    ],
  providers: [NotificationService, AuthenticationGuard, AuthenticationService, UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
