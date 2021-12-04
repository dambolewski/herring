import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './component/user/login/login.component';
import {RegisterComponent} from './component/user/register/register.component';
import {AuthenticationGuard} from "./guard/authentication.guard";
import {SettingsUserComponent} from "./component/user/settings-user/settings-user.component";
import {UserInfoComponent} from "./component/user/user-info/user-info.component";
import {UsersComponent} from "./component/user/users/users.component";
import {HomeComponent} from "./component/home/home.component";
import {ProjectsComponent} from "./component/project/projects/projects.component";
import {ProjectDetailsComponent} from "./component/project/project-details/project-details.component";
import {ProjectOperationalComponent} from "./component/project/project-operational/project-operational.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthenticationGuard]},
  {path: 'user-settings', component: SettingsUserComponent, canActivate: [AuthenticationGuard]},
  {path: 'user-details', component: UserInfoComponent, canActivate: [AuthenticationGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'project-list', component: ProjectsComponent, canActivate: [AuthenticationGuard]},
  {path: 'project-details', component: ProjectDetailsComponent, canActivate: [AuthenticationGuard]},
  {path: 'project-operations', component: ProjectOperationalComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
